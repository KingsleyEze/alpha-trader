# Alpha Trader
## The Application

In the interest of saving you some time, we provided a working [Vue](https://vuejs.org) application. This application
also includes a small set of components for you to use. Please note, using these components is optional, you are welcome
to change them in any way you want, you should only submit something you are comfortable with.

## Using this application

### Pre-requisites

Please make sure to have [Node](https://nodejs.org) 16 installed.

### Running the code

Nothing changes, you can run `yarn` (or `npm install`) to install dependencies.
After that, you can run:

```bash
# npm
npm run dev

# or yarn
yarn dev
```

This will start the application in development mode. It will also start the WebSocket server on port 8425.

You can see the client application running in your browser by going to http://localhost:3000.

---


---
## Documentation
### useStockWebSocket
This hook establishes a WebSocket connection to receive real-time stock data updates.

### Features
Manage WebSocket connection status and retries.
Handle incoming stock data messages.
Expose functionality to subscribe and unsubscribe to specific stock instruments by their ISIN (International Securities Identification Number).

### Dependencies

**rxjs**: Utilized for managing the WebSocket stream and related transformations.
**vue**: Provides reactive state management.

## How to use

**Import the hook:**

`import { useStockWebSocket } from "path-to-the-hook";`

#### **Within a Vue component:**

`const { activeWatchList, connectionStatus, subscribeToInstrument, unsubscribeFromInstrument } = useStockWebSocket();
`

**Bind or utilize the returned data and methods in your component.**

### Data and Methods

`activeWatchList: Ref<Stock[]>`
A reactive reference array that contains the stocks currently in the watchlist. Whenever a new stock message arrives from the WebSocket, it either updates the existing stock details in the list or pushes a new stock.

`connectionStatus: Ref<ConnectionStatus>`
A reactive reference that reflects the current status of the WebSocket connection. It can have values: "disconnected", "connected", or "reconnecting".

`subscribeToInstrument(isin: string)`
Sends a message to the WebSocket to subscribe to updates for a particular stock identified by its ISIN.

`unsubscribeFromInstrument(isin: string)`
Sends a message to the WebSocket to unsubscribe from updates for a particular stock identified by its ISIN.

`Internals`
handleIncomingMessage(message: IncomingWebSocketMessage)
Handles each incoming WebSocket message. It checks if the stock exists in the activeWatchList. If it does, it updates the stock's details, otherwise, it adds the stock to the list.

`rawSocket$: WebSocketSubject<any>`
An RxJS WebSocketSubject that represents the raw WebSocket connection to the server.

`socket$: Observable<any>`
A derived observable from rawSocket$. It manages connection statuses and performs retries in case of failures. Retries occur with exponential back-off delays and up to a maximum retry count.


---

## Questions

1. What happens in case the WebSocket disconnects? How would you go further to keep
   the live data available or inform the user? Please discuss the challenges.
   ```text
   When the WebSocket disconnects, the socket connection doesn't just give up. 
   It tries to reconnect using something called exponential backoff, meaning it waits 
   a bit longer each time before trying again, up to a certain limit. To keep the live 
   data available, I'd probably look into resubscribing to the stocks we were watching
   once we reconnect, and maybe even fetch the latest data to make sure we didn't miss 
   anything. As for informing the user, that's where a clear status update on the front 
   end would come in handy. The challenges? Well, different errors might need different
   handling, and the delay between reconnect attempts might get too long if we're not
   careful. It's all about balancing persistence with the user's need for timely, 
   accurate information.
   ```
2. What happens if a user adds an instrument multiple times to their list? Please discuss possible challenges and
   mitigations.

    ```text
    When a user adds an instrument with a duplicate information to their list, several challenges 
    arise. The user interface may become cluttered, and redundant instruments can lead to inconsistent 
    data views. Additionally, if actions or alerts are associated with instruments, multiple instances
    might trigger unintended consequences. To mitigate these issues, the frontend should have a check
    in place to prevent users from adding duplicates. During integration, it's important to ensure 
    that the backend handles duplicates appropriately and that the frontend provides clear feedback 
    to guide users and avoid confusion. I noticed during integration that without a check in place,
    the backend doesn't seem to add duplicates to the list so nothing breaks.
    ```

3. What potential performance issues might you face when this app scales with multiple subscriptions? How would you
   improve the speed and user experience?

    ```text
    As the app scales with more subscriptions, several performance challenges can emerge.The growing 
    number of subscriptions can lead to a surge in network traffic, with messages between the server
    and client increasing substantially. Browsers have their own constraints; they can only handle 
    so many WebSocket connections, and if every subscription tries to establish a unique connection,
    we might max out quickly. On the backend, there's additional strain: more subscriptions mean more 
    processing, potentially slowing down responses. Meanwhile, the frontend faces its hurdles. 
    Handling and visually representing a vast influx of data in real-time demands resources, and this 
    could make the app sluggish. Not to forget, every active subscription eats into our memory, which, 
    if not kept in check, could lead to memory leaks. Lastly, every subscription might be tapping into
    our database, which can bog it down and cause delays.
    
    To enhance speed and user experience as the app scales, several strategies come to mind. First, 
    by employing multiplexing, we can manage multiple subscriptions through a single WebSocket 
    connection, streamlining communication while respecting browser constraints. Data compression 
    methods, such as MessagePack or WebSocket's inherent capabilities, can minimize data size 
    during transmissions. Rather than bombarding the UI with constant updates, techniques like 
    debouncing and throttling can control the update frequency, delivering a smoother experience. 
    By embracing efficient data structures like buffers and hashmaps, data processing becomes snappier. 
    On the backend, scaling becomes pivotal—think of incorporating load balancers, optimizing queries,
    or even harnessing in-memory databases like Redis for brisk data access. 
    Frontend-wise, virtualization can be a game-changer, especially when dealing with extensive datasets,
    ensuring only visible components render.Additionally, considering lazy loading or pagination helps
    when users have a hefty number of subscriptions, only pulling in what's necessary. Optimizations 
    don't stop there: refined rendering techniques, from memoization to leveraging cutting-edge frontend
    frameworks, can drastically enhance responsiveness. And, of course, keeping users in the loop is 
    paramount; intuitive feedback mechanisms like spinners or progress bars make wait times more palatable. 
    Lastly, proactive monitoring tools are invaluable, keeping a watchful eye on performance metrics, 
    sending timely alerts, and helping pinpoint and address bottlenecks before they escalate.
    ```

---

## How to submit your solution

Please zip your project and submit zip archive via the Greenhouse link attached to the email with the code challenge.
Your dedicated recruiter will receive the notification about your submission and will send it for the team review.
