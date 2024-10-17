import * as React from 'react';
import styles from './PnpImageCarousel.module.scss';
import { IPnpImageCarouselProps } from './IPnpImageCarouselProps';

import { SPService } from '../service/SPService'
import { ImageFit } from 'office-ui-fabric-react';
import { Carousel, CarouselButtonsLocation, CarouselButtonsDisplay, CarouselIndicatorShape } from "@pnp/spfx-controls-react/lib/Carousel";

export interface IPnpImageCarouselState {
  listItems: any[] | undefined;
  errorMessage: string;
}

export default class PnpImageCarousel extends React.Component<IPnpImageCarouselProps, IPnpImageCarouselState> {

  private SPService: SPService;
  constructor(props: IPnpImageCarouselProps) {
    super(props);
    this.SPService = new SPService(this.props.context);
    this.getCarouselItems = this.getCarouselItems.bind(this);
    this.state = {
      listItems: [],
      errorMessage: ''
    };
  }

  public async getCarouselItems() {
    if (this.props.listName) {

      let carouselItems = await this.SPService.getListItems(this.props.listName);

      this.setState({ listItems: carouselItems });
      let carouselItemsMapping = (carouselItems as any[]).map(e => ({
        imageSrc: e.BannerImageUrl.Url,
        title: e.Title,
        description: e.Description,
        showDetailsOnHover: true,
        url: e.FileRef,
        imageFit: ImageFit.cover
      }));

      this.setState({ listItems: carouselItemsMapping });
      console.log("getCarouselItems carouselItemsMapping =>", this.state.listItems);
    }
    else {
      this.setState({ errorMessage: "Please set proper list name in property pane configuration." })
    }
  }

  public componentDidMount() {
    this.getCarouselItems();
  }

  public render(): React.ReactElement<IPnpImageCarouselProps> {
    return (
      <div className={styles.pnpImageCarousel}>
        {this.state.listItems && this.state.listItems.length ?
          <Carousel
            buttonsLocation={CarouselButtonsLocation.center}
            buttonsDisplay={CarouselButtonsDisplay.buttonsOnly}
            contentContainerStyles={styles.carouselContent}
            isInfinite={false}
            indicatorShape={CarouselIndicatorShape.circle}
            pauseOnHover={true}
            element={this.state.listItems}
            containerButtonsStyles={styles.carouselButtonsContainer}
          />
          : <p>{this.state.errorMessage}</p>
        }
      </div>
    );
  }
}