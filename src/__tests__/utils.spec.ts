import { describe, it, expect } from "vitest";

import * as utils from "../utils";

describe("isNight", () => {
    it("should return true if hour is >= 1800", () => {
        let hour: number = new Date().getHours();
        if ( hour < 18 ) {
            expect(utils.isNight()).toBeFalsy();
        }
        else{
            expect(utils.isNight()).toBeTruthy();
        }
    });
  });