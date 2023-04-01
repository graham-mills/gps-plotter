import { AppConfig } from "./config";
import { EventBus, AppInitialisedEvent } from "./events";

/**
 * This class just waits for the app to be initialised and then hides the loading screen and
 * displays the app content.
 */
export class LoadingScreen {
    eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        eventBus.subscribeToAppInitialisedEvent(this.handleAppInitialised.bind(this));
    }

    private handleAppInitialised(event: AppInitialisedEvent): void {
        let loadingScreen = document.getElementById(AppConfig.DOMSymbols.LoadingScreen);
        loadingScreen?.remove();
        let app = document.getElementById(AppConfig.DOMSymbols.Application);
        app?.style.setProperty("visibility", "visible");
    }
}
