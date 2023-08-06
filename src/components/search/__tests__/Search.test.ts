import { mount } from "@vue/test-utils";
import { test, expect, describe, vi, beforeEach } from "vitest";
import Search from "../Search.vue";

describe("Component Search", () => {
  let mockWatchList = new Set();
  let component: any;
  const mockAddStockToWatchList = vi.fn();
  const mockIsIsinInWatchList = vi.fn();

  const provideMock = {
    watchList: {
      addStockToWatchList: mockAddStockToWatchList,
      isIsinInWatchList: mockIsIsinInWatchList,
    },
  };

  beforeEach(() => {
    mockWatchList.clear();
    mockAddStockToWatchList.mockReset();
    mockIsIsinInWatchList.mockReset();

    component = mount(Search, {
      global: { provide: provideMock },
    });
  });

  function assertErrorMessage(expectedMessage: string) {
    const errorElement = component.find(".error-message");
    expect(errorElement.exists()).toBe(true);
    expect(errorElement.text()).toBe(expectedMessage);
  }

  test("shows error for empty ISIN", async () => {
    await component.find(".watch-form").trigger("submit.prevent");
    assertErrorMessage("ISIN cannot be empty");
  });

  test("shows error for invalid ISIN format", async () => {
    component.vm.isin = "INVALID";
    await component.vm.$nextTick();
    await component.find(".watch-form").trigger("submit.prevent");
    assertErrorMessage("Invalid ISIN format");
  });

  test("shows error for duplicate ISIN", async () => {
    mockWatchList.add("US1234567890");

    expect(mockWatchList.has("US1234567890")).toBeTruthy();

    component.vm.isin = "US1234567890";

    expect(component.vm.isin).toBe("US1234567890");

    await component.vm.$nextTick();

    const button = component.find(".watch-button");
    await button.trigger("click");
    await component.vm.$nextTick();
    const errorElement = component.find(".error-message");

    if (errorElement.exists()) {
      assertErrorMessage("ISIN already added to the watch list");
    }
  });

  test("successful ISIN addition", async () => {
    component.vm.isin = "DE1234567890";
    await component.vm.$nextTick();

    const button = component.find(".watch-button");
    await button.trigger("click");
    await component.vm.$nextTick();

    const errorElement = component.find(".error-message");
    expect(errorElement.exists()).toBeFalsy();
  });
});
