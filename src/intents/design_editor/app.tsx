import { useFeatureSupport } from "@canva/app-hooks";
import { Button, FormField, Rows, Text, TextInput } from "@canva/app-ui-kit";
import { addElementAtCursor, addElementAtPoint } from "@canva/design";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as styles from "styles/components.css";

const SAMPLE_VI_TEXT =
  "Chào mừng bạn đến với Markus Agency! Đây là nội dung mẫu tiếng Việt có dấu: ă, â, ê, ô, ơ, ư, đ.";

export const App = () => {
  const [customText, setCustomText] = useState("");
  const isSupported = useFeatureSupport();
  const intl = useIntl();

  // addElementAtPoint works on most design types; addElementAtCursor is the
  // fallback for text-flow design types (e.g. "document") that don't support it.
  const addText = [addElementAtPoint, addElementAtCursor].find((fn) =>
    isSupported(fn),
  );
  const canAddShape = isSupported(addElementAtPoint);

  const notSupportedTooltip = intl.formatMessage({
    defaultMessage: "Không hỗ trợ trên trang thiết kế hiện tại",
    description:
      "Tooltip shown when a button is disabled because the current design page doesn't support the action",
  });

  const addViText = async () => {
    if (!addText) {
      return;
    }
    await addText({ type: "text", children: [SAMPLE_VI_TEXT] });
  };

  const addRectangle = async () => {
    if (!canAddShape) {
      return;
    }
    await addElementAtPoint({
      type: "shape",
      top: 100,
      left: 100,
      width: 200,
      height: 200,
      viewBox: { top: 0, left: 0, width: 100, height: 100 },
      paths: [
        {
          d: "M 0 0 H 100 V 100 H 0 L 0 0",
          fill: { color: "#7C3AED" },
        },
      ],
    });
  };

  const addCustomText = async () => {
    if (!addText || !customText.trim()) {
      return;
    }
    await addText({ type: "text", children: [customText] });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          <FormattedMessage
            defaultMessage="Demo cho Tôm: thêm nội dung vào design Canva đang mở. Mở app này từ bên trong một design để dùng thử."
            description="Intro text explaining what this app demo does"
          />
        </Text>

        <Button
          variant="primary"
          onClick={addViText}
          disabled={!addText}
          tooltipLabel={!addText ? notSupportedTooltip : undefined}
          stretch
        >
          {intl.formatMessage({
            defaultMessage: "Thêm text tiếng Việt",
            description:
              "Button label to add a sample Vietnamese text element to the design",
          })}
        </Button>

        <Button
          variant="secondary"
          onClick={addRectangle}
          disabled={!canAddShape}
          tooltipLabel={!canAddShape ? notSupportedTooltip : undefined}
          stretch
        >
          {intl.formatMessage({
            defaultMessage: "Thêm hình chữ nhật",
            description:
              "Button label to add a rectangle shape element to the design",
          })}
        </Button>

        <FormField
          label={intl.formatMessage({
            defaultMessage: "Nội dung tuỳ chỉnh",
            description: "Label for the custom text input field",
          })}
          value={customText}
          control={(props) => (
            <TextInput
              {...props}
              placeholder={intl.formatMessage({
                defaultMessage: "Nhập nội dung cần đổ vào design...",
                description: "Placeholder for the custom text input field",
              })}
              onChange={setCustomText}
            />
          )}
        />

        <Button
          variant="primary"
          onClick={addCustomText}
          disabled={!addText || !customText.trim()}
          tooltipLabel={!addText ? notSupportedTooltip : undefined}
          stretch
        >
          {intl.formatMessage({
            defaultMessage: "Đổ nội dung vào design",
            description:
              "Button label to add the custom text entered by the user into the design",
          })}
        </Button>
      </Rows>
    </div>
  );
};
