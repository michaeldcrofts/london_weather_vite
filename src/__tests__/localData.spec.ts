import { describe, it, expect } from "vitest";

import {localStore} from "../data";

describe("localData", () => {
    var test_callback = function () {
        console.log("Callback test");
    }
    it("should set local storage and initialise its callback storage", () => {
      expect(localStore).toBeDefined();
      let t = localStore;
      t.setItem("__test__", "xxx",test_callback);
      let test = localStorage.getItem("__test__");
      expect(test).toBe("xxx");
    });
    it("should update the value in local storage"), () => {
        let t = localStore;
        expect(t.setItem).toBeDefined();
        t.setItem("__test__", "yyy");
        let test = localStorage.getItem("__test__");
        expect(test).toBe("yyy");
    }
    it("should callback"), () => {
        let t = localStore;
        t.setItem("__test__", "yyy");
        expect(test_callback).toBeCalled();
    }
  });