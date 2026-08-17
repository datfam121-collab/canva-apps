import { useFeatureSupport } from "@canva/app-hooks";
import { addElementAtCursor, addElementAtPoint } from "@canva/design";
import type { Feature } from "@canva/platform";
import { fireEvent, screen } from "@testing-library/react";
import { App } from "src/intents/design_editor/app";
import { renderInTestProvider } from "src/utils/test_render";

jest.mock("@canva/app-hooks");

// This test demonstrates how to test code that uses functions from the Canva Apps SDK
// For more information on testing with the Canva Apps SDK, see https://www.canva.dev/docs/apps/testing/
describe("Markus Tom content tools", () => {
  const mockIsSupported = jest.fn();
  const mockUseFeatureSupport = jest.mocked(useFeatureSupport);

  beforeEach(() => {
    jest.resetAllMocks();
    mockIsSupported.mockImplementation((fn: Feature) => fn === addElementAtPoint);
    mockUseFeatureSupport.mockReturnValue(mockIsSupported);
  });

  it("adds the sample Vietnamese text element when clicked", () => {
    renderInTestProvider(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Thêm text tiếng Việt" }));

    expect(mockIsSupported).toHaveBeenCalledWith(addElementAtPoint);
    expect(addElementAtPoint).toHaveBeenCalledWith(
      expect.objectContaining({ type: "text" }),
    );
    expect(addElementAtCursor).not.toHaveBeenCalled();
  });

  it("adds a rectangle shape element when clicked", () => {
    renderInTestProvider(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Thêm hình chữ nhật" }));

    expect(addElementAtPoint).toHaveBeenCalledWith(
      expect.objectContaining({ type: "shape" }),
    );
  });

  it("disables the custom content button until text is entered", () => {
    renderInTestProvider(<App />);

    const pourButton = screen.getByRole("button", {
      name: "Đổ nội dung vào design",
    });

    // empty input: click must not add anything
    fireEvent.click(pourButton);
    expect(addElementAtPoint).not.toHaveBeenCalled();

    fireEvent.change(screen.getByPlaceholderText("Nhập nội dung cần đổ vào design..."), {
      target: { value: "Nội dung tuỳ chỉnh" },
    });
    fireEvent.click(pourButton);
    expect(addElementAtPoint).toHaveBeenCalledWith(
      expect.objectContaining({ type: "text", children: ["Nội dung tuỳ chỉnh"] }),
    );
  });
});
