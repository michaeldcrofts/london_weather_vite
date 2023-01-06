import { describe, it, expect } from "vitest";

import {localData} from "../utils";

describe("localData", () => {
    var test_callback = function () {
        console.log("Callback test");
    }
    it("should set local storage and initialise its callback storage", () => {
      expect(localData).toBeDefined();
      let t = new localData;
      t.set("__test__", "xxx",test_callback);
      let test = localStorage.getItem("__test__");
      expect(test).toBe("xxx");
    });
    it("should update the value in local storage"), () => {
        let t = new localData;
        expect(t.update).toBeDefined();
        t.update("__test__", "yyy");
        let test = localStorage.getItem("__test__");
        expect(test).toBe("yyy");
    }
    it("should callback"), () => {
        let t = new localData;
        t.update("__test__", "yyy");
        expect(test_callback).toBeCalled();
    }
  });