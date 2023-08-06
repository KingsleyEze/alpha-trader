import { mount } from "@vue/test-utils";
import { test, expect, describe } from "vitest";
import Header from "../Header.vue";

describe("Component Header", () => {
  test("renders correctly", () => {
    const component = mount(Header);

    // Check if the header exists
    const headerElement = component.find(".header");
    expect(headerElement.exists()).toBeTruthy();

    // Check if the logo exists
    const logoElement = component.find(".header-logo");
    expect(logoElement.exists()).toBeTruthy();
  });

  test("has the correct title in SVG", () => {
    const component = mount(Header);

    const titleElement = component.find("svg > title");
    expect(titleElement.text()).toBe("Trade Republic");
  });
});
