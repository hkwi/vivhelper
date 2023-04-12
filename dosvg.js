const hostname = process.env.KROKIHOST || "kroki.io";
const langs = process.env.KROKILANGS || "mermaid";
const embed = process.env.KROKIEMBED;
const https = require("node:https");
const deasync = require("deasync");
const pako = require("pako");
const p = require("prismjs/components/prism-core");
const r = require("refractor");
const klangs = langs.split(",");

p.hooks.add("wrap", function (env) {
  if (env.type == "base64") {
    env.tag = "img";
    env.classes.push("kroki");
    env.attributes = {
      src: env.content.value
    };
    env.content.value = "";
  }
});
p.hooks.add("after-tokenize", function (env) {
  if (klangs.includes(env.language)) {
    env.tokens = [new p.Token("base64", env.code, null, null)];
  }
});
p.hooks.add("before-tokenize", function (env) {
  if (klangs.includes(env.language)) {
    function use_kroki_direct_src() {
      const data = Buffer.from(env.code, 'utf8')
      const compressed = pako.deflate(data, { level: 9 })
      const result = Buffer.from(compressed).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
      env.code = `https://${hostname}/${env.language}/svg/${result}`;
    }
    function use_kroki_data_src(resolve) {
      const rb = {
        diagram_source: env.code,
        diagram_type: env.language,
        output_format: "svg"
      };
      const req = https.request({
        hostname: hostname,
        port: 443,
        path: "/",
        method: "POST",
      }, res => {
        let resp = [];
        res.on("data", (c) => { resp.push(c); });
        res.on("end", () => {
          const value = Buffer.concat(resp).toString("base64");
          env.code = `data:image/svg+xml;base64,${value}`
          resolve();
        });
      });
      req.write(JSON.stringify(rb));
      req.end();
    };
    if (embed) {
      deasync(use_kroki_data_src)();
    } else {
      use_kroki_direct_src();
    }
  };
});

function func(Prism) {
  klangs.forEach(e => {
    Prism.languages[e] = {
      raw: { pattern: /\A.*\z/m }
    }
  });
}
func.displayName = "kroki";
r.register(func);
