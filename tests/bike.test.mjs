import test from "node:test";
import assert from "node:assert/strict";
import { estimateRange,configurationPrice } from "../content/bike.js";
test("range falls with more help and hills and rises with larger battery",()=>{assert.ok(estimateRange(360,1,"flat")>estimateRange(360,3,"flat"));assert.ok(estimateRange(360,2,"flat")>estimateRange(360,2,"hills"));assert.ok(estimateRange(540,2,"mixed")>estimateRange(360,2,"mixed"));});
test("configuration costs include only selected upgrades",()=>{assert.equal(configurationPrice("mist","city"),129000);assert.equal(configurationPrice("ember","long"),151000);});
test("unsupported values never produce fabricated estimates",()=>{assert.throws(()=>estimateRange(100,2,"flat"),RangeError);assert.throws(()=>estimateRange(360,4,"flat"),RangeError);assert.throws(()=>configurationPrice("red","city"),RangeError);});
