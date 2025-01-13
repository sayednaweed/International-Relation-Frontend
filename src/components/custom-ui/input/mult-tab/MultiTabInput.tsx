import React, { ReactElement } from "react";
import { ReactNode } from "react";
import SingleTab from "./parts/SingleTab";
import OptionalTab from "./parts/OptionalTab";

export interface MultiTabInputProps {
  children:
    | ReactElement<typeof SingleTab | typeof OptionalTab>
    | ReactElement<typeof SingleTab | typeof OptionalTab>[];
}

export default function MultiTabInput(props: MultiTabInputProps) {
  const { children } = props;
  const processTabs = (children: ReactNode) => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const levelOneChildren = child.props.children;
        if (child.type === SingleTab) {
          console.log(child);
          const comp: ReactElement = child;
          return React.cloneElement(comp, {
            onClick: () => console.log(child.props.children as string), // Pass the tab value (children)
          });
        } else if (child.type === OptionalTab) {
          return <div className="processed-optional-tab">{child}</div>;
        }
      }
      return child; // Return unmodified child if it's neither SingleTab nor OptionalTab
    });
  };
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div>{processTabs(children)}</div>
      {/* Body */}
      <input placeholder="Content" />
    </div>
  );
}
