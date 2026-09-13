---
title: Nmap Cheatsheet
description: Quick reference for Nmap host discovery, port scanning, service/version detection, and NSE scripting.
tags: [nmap, scanning, recon, network]
order: 1
date: 2026-08-20
---

Nmap ("Network Mapper") is the standard tool for host discovery and port scanning. This sheet covers the flags you'll reach for in almost every engagement.

## Host discovery

```bash
# Ping sweep only, no port scan
nmap -sn 10.10.10.0/24

# Skip host discovery (treat all hosts as up)
nmap -Pn 10.10.10.5
```

## Port scanning

```bash
# Fast scan of the top 100 ports
nmap -F 10.10.10.5

# Scan specific ports
nmap -p 22,80,443 10.10.10.5

# Scan all 65535 TCP ports
nmap -p- 10.10.10.5

# UDP scan (slow — combine with a smaller port list)
nmap -sU --top-ports 20 10.10.10.5
```

## Scan types

| Flag | Scan type | Notes |
| --- | --- | --- |
| `-sS` | TCP SYN scan | Default for privileged users, doesn't complete the handshake |
| `-sT` | TCP connect scan | Used when raw sockets aren't available |
| `-sU` | UDP scan | Slower, often needs `--top-ports` to stay fast |
| `-sV` | Version detection | Probes open ports to identify service/version |
| `-sC` | Default script scan | Runs the `default` NSE category |
| `-O` | OS detection | Fingerprints the target's OS |

## Service and version detection

```bash
# Version detection with default scripts, on all ports, no ping
nmap -sC -sV -Pn -p- 10.10.10.5 -oA full-scan
```

`-oA full-scan` writes output in normal, XML, and grepable formats simultaneously — always keep the raw output.

## Timing and performance

```bash
# Aggressive timing (T0 paranoid ... T5 insane)
nmap -T4 -p- 10.10.10.5

# Increase parallelism explicitly
nmap --min-rate 1000 -p- 10.10.10.5
```

## NSE scripting

```bash
# Run a specific script
nmap --script=http-title -p 80 10.10.10.5

# Run a category of scripts
nmap --script=vuln -p- 10.10.10.5

# Pass script arguments
nmap --script=smb-enum-shares --script-args smbuser=guest 10.10.10.5
```

Common useful categories: `default`, `discovery`, `vuln`, `auth`, `safe`.

## Output formats

```bash
nmap -oN scan.txt 10.10.10.5    # normal
nmap -oX scan.xml 10.10.10.5    # XML
nmap -oG scan.gnmap 10.10.10.5  # grepable
nmap -oA scan 10.10.10.5        # all three at once
```

## A solid all-purpose command

```bash
nmap -sC -sV -Pn -T4 -p- --min-rate 1000 -oA initial <target>
```

Start broad, then pivot to targeted `--script` runs once you know which services are exposed.
