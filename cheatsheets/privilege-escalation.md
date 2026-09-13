---
title: Linux Privilege Escalation Cheatsheet
description: A checklist for enumerating and escalating privileges on a Linux host you're authorized to test.
tags: [linux, privesc, enumeration]
order: 1
date: 2026-08-25
---

A working checklist for local enumeration once you have an initial low-privileged shell on a Linux target you are authorized to assess.

## Automated enumeration first

```bash
# LinPEAS — broad automated enumeration
curl -L https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh -o linpeas.sh
sh linpeas.sh

# linux-exploit-suggester — matches kernel/version against known CVEs
./les.sh
```

Treat automated tool output as a starting point, not a conclusion — always verify manually.

## Who am I, and what can I do

```bash
id
whoami
sudo -l                 # commands you can run as another user
groups
cat /etc/passwd | grep -E "sh$"   # accounts with a real shell
```

## SUID / SGID binaries

```bash
find / -perm -4000 -type f 2>/dev/null   # SUID
find / -perm -2000 -type f 2>/dev/null   # SGID
```

Cross-reference any unusual binary against [GTFOBins](https://gtfobins.github.io/) for a known privesc technique (shell escape, file read/write, etc.).

## Cron jobs and scheduled tasks

```bash
cat /etc/crontab
ls -la /etc/cron.*
crontab -l
```

Look for jobs that run as root and call a script writable by your current user.

## Writable files and paths

```bash
find / -writable -type f 2>/dev/null | grep -v "^/proc"
echo $PATH
```

A writable directory earlier in `$PATH` than expected can enable a PATH hijack against a script that calls system binaries without an absolute path.

## Kernel and OS version

```bash
uname -a
cat /etc/os-release
```

Match the exact kernel version against known local exploits — but confirm exploitability rather than firing blindly, unstable exploits can crash the box.

## Capabilities

```bash
getcap -r / 2>/dev/null
```

A binary with `cap_setuid+ep` or similar can often be abused directly, independent of SUID.

## Credentials lying around

```bash
grep -ri "password" /etc/*.conf 2>/dev/null
find / -name "*.bak" -o -name "*.old" 2>/dev/null
cat ~/.bash_history
find / -name "id_rsa*" 2>/dev/null
```

## Quick priority order

1. `sudo -l` — misconfigured sudo rules are the fastest win.
2. SUID/SGID binaries against GTFOBins.
3. Writable root-owned cron jobs or services.
4. Kernel exploits — last resort, and only against a snapshot or expendable target.
