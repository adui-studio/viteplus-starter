import assert from "node:assert/strict";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { homeFiles } from "../src/application-home.mjs";

for (const framework of ["vue", "react"]) {
  test(`${framework}正式页：错误密钥后正确重试清除旧提示，新的错误及取消仍保持`, async () => {
    const source = homeFiles({
      name: "unlock-example",
      framework,
      language: "js",
      screen: true,
      engine: "three",
      modelProtection: "external",
    })[`src/components/SceneView.${framework === "vue" ? "vue" : "jsx"}`];
    // Execute the generated event handler with the adapters' real false/onError contract.
    const handler = source.match(/async function unlock\(event\) \{[^\n]+\}/)?.[0];
    assert.ok(handler);
    const message = { value: "previous error" },
      model = {},
      calls = [];
    class Input {
      constructor(file) {
        this.files = file ? [file] : [];
        this.value = "selection";
      }
    }
    const active = {
      async loadBundledModel(asset) {
        assert.equal(asset, model);
        calls.push("load");
        if (failure) message.value = "authentication failed";
        return !failure;
      },
    };
    let failure = true;
    const context = {
      HTMLInputElement: Input,
      models: [model],
      message,
      setMessage: (value) => (message.value = value),
      scene: framework === "vue" ? active : { current: active },
      keyring: {
        async unlock(file) {
          calls.push("unlock");
          if (file === "malformed") throw new Error("invalid file");
          return true;
        },
      },
    };
    const unlock = runInNewContext(`(${handler})`, context);
    await unlock({ target: new Input() });
    assert.equal(message.value, "previous error");
    assert.deepEqual(calls, []);
    const input = new Input("wrong-key");
    await unlock({ target: input });
    assert.equal(input.value, "");
    assert.equal(message.value, "authentication failed");
    failure = false;
    await unlock({ target: new Input("correct-key") });
    assert.equal(message.value, "");
    await unlock({ target: new Input("malformed") });
    assert.match(message.value, /invalid file/);
    assert.deepEqual(calls, ["unlock", "load", "unlock", "load", "unlock"]);

    let finish;
    context.keyring.unlock = () => new Promise((resolve) => (finish = resolve));
    const pending = unlock({ target: new Input("late-key") });
    if (framework === "vue") context.scene = {};
    else context.scene.current = {};
    message.value = "replacement scene";
    finish(true);
    await pending;
    assert.equal(message.value, "replacement scene");
    assert.equal(calls.filter((call) => call === "load").length, 2);
  });
}
