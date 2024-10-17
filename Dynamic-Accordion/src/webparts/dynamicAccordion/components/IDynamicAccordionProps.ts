import { DisplayMode } from "@microsoft/sp-core-library";
export interface IDynamicAccordionProps {
  listId: string;
  accordionTitle: string;
  columnTitle: string;
  selectedChoice: string;
  accordianTitleColumn: any;
  accordianContentColumn: any;
  accordianSortColumn: string;
  isSortDescending: boolean;
  allowZeroExpanded: boolean;
  allowMultipleExpanded: boolean;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
  onConfigure: () => void;
}
