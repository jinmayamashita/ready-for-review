import { isLabelInPR } from "../isLabelInPR";

describe("isLabelInPR", () => {
  test("should be return true", () => {
    const listLabels = [
      {
        name: "foo",
      },
    ];
    expect(isLabelInPR(listLabels, "foo")).toBe(true);
  });
  test("should be return false", () => {
    const listLabels = [
      {
        name: "bar",
      },
    ];
    expect(isLabelInPR(listLabels, "foo")).toBe(false);
  });
});
