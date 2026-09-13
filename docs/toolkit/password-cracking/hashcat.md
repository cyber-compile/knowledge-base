---
title: hashcat
---
# Hashcat

*Password Cracking · GPU-accelerated offline hash cracker*

Hashcat is an offline password-recovery tool: it takes a hash (or list of
hashes) you already have and tries candidate passwords against it using
your GPU (or CPU) for speed. It supports 300+ hash algorithms and several
attack strategies — straight dictionary, rule-mangled dictionary, mask
(brute-force with a pattern), and hybrid combinations of those.

**Maintained by:** the hashcat project (Jens "atom" Steube and contributors) · **License:** MIT · **Last verified on this page:** 2026-09-09

---

## Where it fits in a real workflow

Hashcat sits downstream of hash *acquisition*, not acquisition itself —
it never touches the network or the target. A typical path looks like:

1. **Get the hashes.** NTDS.dit + SYSTEM hive via `secretsdump.py` (or a
   DCSync), `/etc/shadow` after root, Kerberoasting a service account's
   TGS with `GetUserSPNs.py`, or NTLM captured passively with Responder.
2. **Identify the hash type.** `hashcat --identify hash.txt` (or
   `name-that-hash`) to get the right `-m` mode number — guessing wrong
   here wastes GPU time on a mode that can never match.
3. **Quick-win pass first.** `rockyou.txt` combined with a mature rule
   file (`best64.rule`, or `OneRuleToRuleThemAll`) usually clears the
   weak/reused passwords in minutes to a couple of hours, before you
   spend real compute on anything smarter.
4. **Targeted dictionary, built from the engagement.** Company name
   variants, a `CeWL`-scraped wordlist from the target's own site,
   relevant breach-corpus terms — run through the same rule files.
5. **Mask/hybrid pass for policy-shaped passwords.** If you know the
   password policy (`Company2026!`-style patterns are common in
   enterprise AD environments), a mask or hybrid attack targets that
   structure directly instead of guessing blind.
6. **Feed cracked creds back into the engagement.** Password reuse
   across other accounts/services, privilege escalation via a cracked
   admin or service account, or — for a pentest report — evidence for a
   password-policy finding.

The branch point that matters: if the quick-win pass clears a large
chunk of accounts, that's already a reportable finding (policy weakness)
even before you burn hours on mask attacks for the rest.

---

## Where it lies to you

> **Gotcha: `--show` can report zero cracks that actually happened.**
> Hashcat writes every crack to a potfile (`hashcat.potfile` by default)
> and `--show` just diffs your input hash file against that potfile. If
> you ran with `--potfile-disable`, used a different `--potfile-path`
> between runs, or moved to a new machine, previously-cracked hashes
> won't show up — it looks like nothing was recovered, and people
> re-run the entire attack from scratch instead of checking the potfile
> path first.

> **Gotcha: optimized kernels (`-O`) silently drop long passwords.**
> The `-O` flag (optimized kernels, much faster) enforces a maximum
> candidate length per hash mode — commonly 32 characters, sometimes
> less depending on the algorithm. Candidates longer than that limit are
> simply never tried, with no per-candidate warning during the run. A
> completed job that says "0 left, mask exhausted" can still mean a
> valid 40-character passphrase was never actually attempted.

> **Gotcha: "Recovered: X/Y" counts unique hashes, not accounts.**
> Hashcat dedupes identical hash values within a run. Dump an NTDS.dit
> from a real AD environment and you'll typically find dozens of
> accounts sharing the same weak password — so "Recovered: 40/40" can
> mean 40 *unique* password hashes cracked out of far more total
> accounts. Reporting "we cracked every hash" without checking the
> account-to-hash mapping overstates (or understates) the real exposure.

> **Gotcha: `-b` benchmark numbers don't survive contact with a real
> attack.** Benchmark mode hashes a synthetic in-memory candidate with
> no wordlist I/O and no rule engine in play. A real run against a large
> wordlist through `OneRuleToRuleThemAll` (52k+ rules) is doing far more
> work per candidate and streaming from disk — real throughput is
> routinely well below the benchmark number. Capacity-planning a
> cracking job off `-b` alone leads to blown time estimates.

---

## The defender's-eye view

The important insight here is a negative one: **hashcat itself generates
no detectable signal**, because it runs entirely offline on hardware the
defender doesn't control. There's no packet, no auth attempt, nothing to
alert on. The detection opportunity is entirely upstream, at the point
the hashes were *acquired* — and downstream, if the cracked password
gets reused.

| Signal | What it looks like | Where to look |
|---|---|---|
| NTDS.dit extraction | Volume Shadow Copy creation followed by `ntdsutil`/`secretsdump`-style access to `NTDS.dit` and the `SYSTEM` hive | Windows Event ID 4688 (process creation), VSS service logs |
| DCSync | A non-DC principal issuing `DS-Replication-Get-Changes` / `-All` requests | Windows Event ID 4662 with the replication GUIDs, or a DC-behavior baseline in your SIEM |
| Kerberoasting | A spike in TGS requests (Event ID 4769) for accounts using RC4 encryption, especially many in a short window | Domain controller security logs |
| LSASS credential access | Process handle opened to `lsass.exe` by an unusual process | EDR, Event ID 4656/4663, Sysmon event 10 |
| Cracked-password reuse | A successful login using a newly-cracked password from an unusual source IP, time, or on a service the account doesn't normally touch | Auth logs correlated against your engagement's cracked-credential list |

If you're writing this up for a client, the recommendation isn't "detect
hashcat" — it's "detect and alert on the extraction techniques above,
and force credential rotation immediately once any hash dump is
confirmed, regardless of whether cracking succeeds."

---

## Verdict: when to reach for it

**Reach for Hashcat when:**

- You already have a hash (or hash dump) and GPU hardware to throw at it.
- The hash is a fast/GPU-friendly algorithm — NTLM, MD5, SHA1,
  NetNTLMv2, most raw hash types.
- You need scale: many hashes, large wordlists, or a big keyspace mask.

**Reach for something else when:**

- You need to attack a *live* login (SSH, RDP, a web login form) —
  hashcat doesn't talk to the network at all; that's Hydra, Medusa, or
  CrackMapExec's job, not hashcat's. This is the single most common
  beginner mix-up with this tool.
- The hash is memory-hard/adaptive (bcrypt, scrypt, Argon2). Hashcat
  supports these modes, but the GPU advantage shrinks dramatically by
  design — a well-tuned CPU run (e.g. John the Ripper) can be
  competitive, and neither will be "fast."

**Maintenance status:** actively maintained with a large community rule
and wordlist ecosystem (`OneRuleToRuleThemAll`, `rockyou`, hashcat's own
`hashcat-utils`) — a safe long-term bet for a cracking toolkit.

---

## Worth knowing before you start

GPU backend setup is the most common source of first-run frustration,
not the tool itself. Run `hashcat -I` before anything else to confirm
your GPU is actually detected as a backend device — on a lot of Kali VMs
(no GPU passthrough) hashcat silently falls back to CPU-only, runs at a
fraction of expected speed, and gives newcomers the false impression
that "hashcat is just slow." On Linux, make sure you have the vendor
runtime installed and matching your driver (NVIDIA: the CUDA or OpenCL
runtime; AMD: ROCm) — a driver/runtime mismatch is the usual cause of
`-I` showing no usable devices.

---

## Certification & interview relevance

OSCP-style exams and labs routinely put a hash dump (a captured NTLM
hash, a cracked archive, a KeePass database) in front of you and expect
you to identify the hash type and clear it with hashcat or John against
`rockyou.txt` as a step toward privilege escalation or lateral movement
— not as the goal itself. Being fluent enough to identify a hash mode
and pick dictionary-vs-mask correctly, quickly, matters more for these
exams than memorizing flags.

---

## Legal & scope notes

Hashcat itself carries no usage restriction (MIT license, no EULA). The
legal exposure is entirely about how the hashes were obtained — cracking
a hash you weren't authorized to acquire is the same offense as any
other unauthorized access, and cracking it afterward doesn't add a
second offense. The engagement-specific nuance to flag in a scope
document: some clients' rules of engagement require you to *stop and
report* on cracking a Domain Admin or other Tier 0 credential rather
than using it to continue the test — confirm that boundary before you
start cracking, not after you've already got the password.

---

## See also

- Password Cracking overview (page coming soon)
- Certifications guide (page coming soon)
- John the Ripper — CPU-based alternative with a different rule engine (page coming soon)
- Hydra — for live/online authentication attacks, not offline hashes (page coming soon)
