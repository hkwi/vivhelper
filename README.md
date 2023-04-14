vivliostyle-cli helper script.

## dosvg
dosvg.js replaces codeblock into svg image using [kroki](https://kroki.io/) API.

Preloading the library will change the output.

```
NODE_OPTIONS=--require=vivhelper vivliostyle build input.md -o output.pdf
```

Options are passed in environment variables.
- KROKIHOST : kroki host, calling as `https://${KROKIHOST}`. This defaults to `kroki.io`
- KROKILANGS : Comma-delimited code block languages, which you'd like to convert to svg. This defaults to `mermaid`. `plantuml`, `mermaid,plantuml` may be used.
- KROKIEMBED : Define this to use `data:` instead of `https://${KUROKIHOST}` img.src URL.

One more hint, if `KROKIHOST` use self-signed certificate, then use both `NODE_EXTRA_CA_CERTS=cert.crt KROKIEMBED=1` would work.
