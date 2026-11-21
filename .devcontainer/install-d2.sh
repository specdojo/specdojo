#!/bin/sh
set -eu

# Release digests: https://github.com/d2lang/d2/releases/expanded_assets/v0.9.0
d2_version=0.9.0
destination=${1:-/usr/local/bin}
case "$(uname -s)/$(uname -m)" in
  Linux/x86_64) architecture=amd64; digest=5669ddc46b99e942cc96078f4a4e36d5e62103348f4c05179ede27802fdd87a9 ;;
  Linux/aarch64|Linux/arm64) architecture=arm64; digest=ac2c028697199479acb321db1e3d68caee9f2ba492ed73caa3cd13f3829bf913 ;;
  *) echo "Unsupported D2 platform: $(uname -s)/$(uname -m)" >&2; exit 1 ;;
esac
temporary=$(mktemp -d)
trap 'rm -rf "$temporary"' EXIT HUP INT TERM
curl -fsSL --retry 3 "https://github.com/d2lang/d2/releases/download/v${d2_version}/d2-v${d2_version}-linux-${architecture}.tar.gz" -o "$temporary/d2.tar.gz"
echo "$digest  $temporary/d2.tar.gz" | sha256sum -c -
tar -xzf "$temporary/d2.tar.gz" -C "$temporary"
install -d "$destination"
install -m 0755 "$temporary/d2-v${d2_version}/bin/d2" "$destination/d2"
actual=$("$destination/d2" version)
[ "${actual#v}" = "$d2_version" ] || { echo "Unexpected D2 version: $actual" >&2; exit 1; }
