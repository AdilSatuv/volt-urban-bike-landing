import test from "node:test";
import assert from "node:assert/strict";
import {readConfiguration,configurationLink} from "../lib/configuration-link.js";
test("shared configurations round trip without carrying unrelated query data",()=>{const expected={finish:"ember",battery:"long",assist:3,terrain:"hills"};const url=new URL(configurationLink("https://example.com/?tracking=123#ride",expected));assert.deepEqual(readConfiguration(url.search),expected);assert.equal(url.hash,"#configure");assert.equal(url.searchParams.has("tracking"),false);});
test("invalid or repeated input cannot enter product state",()=>{assert.deepEqual(readConfiguration("?finish=unknown&battery=long&assist=0&terrain=bad"),{finish:"mist",battery:"long",assist:2,terrain:"mixed"});assert.equal(readConfiguration("?finish=ink&finish=ember").finish,"mist");});
