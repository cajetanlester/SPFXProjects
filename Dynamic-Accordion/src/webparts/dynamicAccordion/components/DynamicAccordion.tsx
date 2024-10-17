import * as React from 'react';
import styles from './DynamicAccordion.module.scss';
import type { IDynamicAccordionProps } from './IDynamicAccordionProps';

import { SPFI } from "@pnp/sp";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import "./dynamicAccordion.css";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { getSP } from "../../../utils/pnpjs-config";


export interface IDynamicAccordionState {
  items: Array<string>;
  choices: Array<string>;
  allowMultipleExpanded: boolean;
  allowZeroExpanded: boolean;
}

export default class DynamicAccordion extends React.Component<IDynamicAccordionProps, IDynamicAccordionState> {
  private _sp: SPFI;

  constructor(props: IDynamicAccordionProps) {
    super(props);

    this.state = {
      items: new Array<string>(),
      choices: new Array<string>(),
      allowMultipleExpanded: this.props.allowMultipleExpanded,
      allowZeroExpanded: this.props.allowZeroExpanded,
    };

    this._sp = getSP();
    this.getListItems();
  }
  private getListItems(): void {
    if (
      typeof this.props.listId !== "undefined" &&
      this.props.listId.length > 0 &&
      typeof this.props.columnTitle !== "undefined" &&
      this.props.columnTitle.length > 0 &&
      typeof this.props.selectedChoice !== "undefined" &&
      this.props.selectedChoice.length > 0
    ) {
      let orderByQuery = '';
      if (this.props.accordianSortColumn) {
        orderByQuery = `<OrderBy>
          <FieldRef Name='${this.props.accordianSortColumn}' ${this.props.isSortDescending ? 'Ascending="False"' : ''} />
        </OrderBy>`;
      }

      const query = `<View>
        <Query>
          <Where>
            <Eq>
              <FieldRef Name='${this.props.columnTitle}'/>
              /*<Value Type='Text'>${this.props.selectedChoice}</Value>*/
            </Eq>
          </Where>
          ${orderByQuery}
        </Query>
      </View>`;

      const theAccordianList = this._sp.web.lists.getById(this.props.listId);
      theAccordianList
        .getItemsByCAMLQuery({
          ViewXml: query,
        }) //.select("Title", "Answer", "Category")
        .then((results: Array<string>) => {
          this.setState({
            items: results,
          });
        })
        .catch((error: any) => {
          console.log("Failed to get list items!");
          console.log(error);
        });
    }
  }

  public componentDidUpdate(prevProps: IDynamicAccordionProps): void {
    if (prevProps.listId !== this.props.listId) {
      this.getListItems();
    }

    if (
      prevProps.allowMultipleExpanded !== this.props.allowMultipleExpanded ||
      prevProps.allowZeroExpanded !== this.props.allowZeroExpanded
    ) {
      this.setState({
        allowMultipleExpanded: this.props.allowMultipleExpanded,
        allowZeroExpanded: this.props.allowZeroExpanded,
      });
    }
  }


  public render(): React.ReactElement<IDynamicAccordionProps> {
    const listSelected: boolean =
      typeof this.props.listId !== "undefined" && this.props.listId.length > 0;
    const { allowMultipleExpanded, allowZeroExpanded } = this.state;
    return (
      <div className={styles.dynamicAccordion}>
        {!listSelected && (
          <Placeholder
            iconName="MusicInCollectionFill"
            iconText="Configure your web part"
            description="Select a list with a Title field and Content field to have its items rendered in a collapsible accordion format"
            buttonLabel="Choose a List"
            onConfigure={this.props.onConfigure}
          />
        )}
        {listSelected && (
          <div>

            <WebPartTitle
              displayMode={this.props.displayMode}
              title={this.props.selectedChoice}
              updateProperty={this.props.updateProperty}
            />

            <Accordion
              allowZeroExpanded={allowZeroExpanded}
              allowMultipleExpanded={allowMultipleExpanded}

            >
              {this.state.items.map((item: string) => {
                return (
                  <AccordionItem key={item}>
                    <AccordionItemHeading>
                      <AccordionItemButton
                        title={item[this.props.accordianTitleColumn]}
                      >
                        {item[this.props.accordianTitleColumn]}
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: item[this.props.accordianContentColumn],
                        }}
                      />
                    </AccordionItemPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        )}
      </div>
    );
  }

}
