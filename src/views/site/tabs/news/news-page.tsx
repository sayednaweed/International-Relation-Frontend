import MultiTabInput from "@/components/custom-ui/input/mult-tab/MultiTabInput";
import OptionalTabs from "@/components/custom-ui/input/mult-tab/parts/OptionalTab";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";

export default function NewsPage() {
  return (
    <div>
      <MultiTabInput>
        <SingleTab>English</SingleTab>
        <OptionalTabs>
          <SingleTab>Farsi</SingleTab>
          <SingleTab>Pashto</SingleTab>
        </OptionalTabs>
      </MultiTabInput>
    </div>
  );
}
