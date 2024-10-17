import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/sites";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/lists"
import { graphfi } from "@pnp/graph";
import { MSGraphClient } from "@microsoft/sp-http";
import { LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";
import { sp } from '@pnp/sp/presets/all';

export default class spservices {
    /* private graphClient: MSGraphClient*/
    private sp: SPFI;
    constructor(private context: WebPartContext) {
        spfi().using(SPFx(this.context));
        graphfi().using(SPFx(this.context));
       0
        // Init
        this.onInit();
    }
    private async onInit(): Promise<void> {

        this.sp = spfi().using(SPFx(this.context));
    }
    public async getSiteLists(siteUrl: string) {

        let results: any[] = [];

        if (!siteUrl) {
            return [];
        }

        try {
            const web = await this.sp.web()
            results = await this.sp.web.lists




        } catch (error) {
            return Promise.reject(error);
        }
        return results;
    }
    public async getImages(siteUrl: string, listId: string, numberImages: number): Promise<any[]> {
        let results: any[] = [];
        try {

            const web = await this.sp.web.getParentWeb();
            /* results = await web.lists
                    .getById(listId).items
                    .select('Title', 'Description', 'File_x0020_Type', 'FileSystemObjectType', 'File/Name', 'File/ServerRelativeUrl', 'File/Title', 'File/Id', 'File/TimeLastModified')
                    .top(numberImages)
                    .expand('File')
                    .filter((`File_x0020_Type eq  'jpg' or File_x0020_Type eq  'png' or  File_x0020_Type eq  'jpeg'  or  File_x0020_Type eq  'gif' or  File_x0020_Type eq  'mp4'`))
                    .orderBy('Id')
                    .usingCaching()
                    .get();*/
        } catch (error) {
            return Promise.reject(error);
        }
        // sort by name

        return results;
    }
}