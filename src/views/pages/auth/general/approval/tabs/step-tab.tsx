export interface ApprovedStepTabProps {
  title: string;
}

export default function StepTab(props: ApprovedStepTabProps) {
  const { title } = props;
  return <div>{title}</div>;
}
