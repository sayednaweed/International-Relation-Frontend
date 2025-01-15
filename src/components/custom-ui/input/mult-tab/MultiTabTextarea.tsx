import React, { ReactElement } from "react";
import { ReactNode } from "react";
import SingleTab from "./parts/SingleTab";
import OptionalTab from "./parts/OptionalTab";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface MultiTabTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  children:
    | ReactElement<typeof SingleTab | typeof OptionalTab>
    | ReactElement<typeof SingleTab | typeof OptionalTab>[];
  userData: any;
  errorData?: any;
  setUserData: any;
  highlightColor: string;
  placeholder?: string;
  tabsClassName?: string;
  title: string;
  name: string;
}

const MultiTabTextarea = React.forwardRef<
  HTMLTextAreaElement,
  MultiTabTextareaProps
>((props, ref: any) => {
  const {
    className,
    name,
    tabsClassName,
    children,
    userData,
    errorData,
    setUserData,
    highlightColor,
    placeholder,
    title,
    ...rest
  } = props;
  const selectionName = `${name}_selections`;

  const tabChanged = (tabName: string) => {
    setUserData({
      ...userData,
      [selectionName]: tabName,
      default_tab: tabName,
    });
  };
  const inputOnchange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, name } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const processTabs = (children: ReactNode) => {
    // let selectedKey = userData[selectionName];
    let defaultTab = userData.default_tab;
    let key = "";

    const elements = React.Children.map(children, (child, mainIndex) => {
      if (React.isValidElement(child)) {
        const levelOneChildren = child.props.children;
        if (child.type === SingleTab) {
          // Rename for distinct data store e.g. username_english,
          if (mainIndex === 0 && !defaultTab) {
            defaultTab = levelOneChildren;
            key = generateUniqueName(name, levelOneChildren);
          }
          const comp: ReactElement = child;
          let classNameOne = child.props.className;
          const newColor =
            defaultTab === levelOneChildren
              ? ` ${highlightColor}`
              : mainIndex === 0 && !defaultTab
              ? ` ${highlightColor}`
              : "";
          if (classNameOne) {
            classNameOne += newColor;
          } else {
            classNameOne = newColor;
          }
          return React.cloneElement(comp, {
            className: classNameOne,
            onClick: () => tabChanged(levelOneChildren), // Pass the tab value (children)
          });
        } else if (child.type === OptionalTab) {
          if (Array.isArray(levelOneChildren)) {
            if (mainIndex == 0 && !defaultTab) {
              defaultTab = levelOneChildren[0].props.children;
              key = generateUniqueName(
                name,
                levelOneChildren[0].props.children
              );
            }
            return (
              <div className="flex gap-1">
                {React.Children.map(levelOneChildren, (childInner, index) => {
                  const levelTwoChildren = childInner.props.children;
                  const selectItemTextInner = levelTwoChildren;

                  let classNameOne = childInner.props.className;
                  const newColor =
                    defaultTab === selectItemTextInner
                      ? ` ${highlightColor}`
                      : mainIndex === 0 && !defaultTab
                      ? ` ${highlightColor}`
                      : "";
                  if (classNameOne) {
                    classNameOne += newColor;
                  } else {
                    classNameOne = newColor;
                  }
                  return (
                    <>
                      {React.cloneElement(childInner, {
                        className: classNameOne,
                        onClick: () => tabChanged(selectItemTextInner), // Pass the tab value (children)
                      })}
                      {index % 2 == 0 && (
                        <div className="font-semibold text-[18px] text-primary/80">
                          │
                        </div>
                      )}
                    </>
                  );
                })}
              </div>
            );
          } else if (mainIndex == 0 && !defaultTab) {
            key = generateUniqueName(name, levelOneChildren.props.children);
          }
        }
      }
      // return child; // Return unmodified child if it's neither SingleTab nor OptionalTab
    });
    const selectTab = userData[key];
    return { elements, selectTab, defaultTab, key };
  };

  const { elements, selectTab, defaultTab, key } = processTabs(children);
  console.log(userData);

  return (
    <div className="flex flex-col border rounded-sm p-2">
      {/* Title */}
      <h1 className="ltr:text-2xl-ltr rtl:text-2xl-rtl font-semibold">
        {title}
      </h1>
      {/* Header */}
      <div className={cn("flex gap-x-4", tabsClassName)}>{elements}</div>
      {/* Body */}
      <Textarea
        {...rest}
        className={cn(
          " ring-0 mt-2 outline-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
          className
        )}
        ref={ref}
        name={key}
        key={defaultTab}
        placeholder={placeholder}
        onChange={inputOnchange}
        defaultValue={selectTab}
      />
    </div>
  );
});

export default MultiTabTextarea;

const generateUniqueName = (name: string, transName: string) =>
  `${name}_${transName}`;
