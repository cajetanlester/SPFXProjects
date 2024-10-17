import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from '@pnp/sp/presets/all';

export class SPService {
    constructor(private context: WebPartContext) {
        sp.setup({
            spfxContext: this.context as any
        });
    }

    public async getListItems(listName: string) {
        try {
            let listItems: any[] = await sp.web.lists.getByTitle(listName)
                .items.top(5).orderBy("Created", false)
                .select("Title,Description,BannerImageUrl,FileRef")
                .filter("PromotedState eq 2")
                .expand().get();
            return listItems;
        } catch (err) {
            Promise.reject(err);
        }
    }

    public async getFields(selectedList: string): Promise<any> {
        try {
            const allFields: any[] = await sp.web.lists
                .getById(selectedList).
                fields.
                filter("Hidden eq false and ReadOnlyField eq false").get();;
            return allFields;
        }
        catch (err) {
            Promise.reject(err);
        }
    }
}


