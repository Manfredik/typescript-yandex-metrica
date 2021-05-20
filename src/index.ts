declare const Ya: any;

export class Metrika {
  private _metricaInsert?: Promise<YandexMetrika>;
  private _counter!: YandexMetrika;
  private readonly counterConfig: InitParameters;

  constructor(
    id: number,
    clickmap: boolean = true,
    trackLinks: boolean = true,
    accurateTrackBounce: boolean = true,
    webvisor: boolean = true,
    trackHash: boolean = false,
    defer: boolean = false,
    loadCounterAfterInitialize: boolean = true,
  ) {
    this.counterConfig = {
      id,
      defer,
      clickmap,
      trackLinks,
      accurateTrackBounce,
      webvisor,
      trackHash,
      triggerEvent: true,
    };
    if (loadCounterAfterInitialize) {
      this.getCounter();
    }
  }

  public getCounter(): Promise<YandexMetrika> {
    if (typeof this._metricaInsert === 'undefined') {
      this._metricaInsert = new Promise<YandexMetrika>((resolve, reject) => {
        const node: HTMLScriptElement | undefined = document.getElementsByTagName('script')[0];
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://mc.yandex.ru/metrika/tag.js';
        script.onload = (e: Event) => {
          // resolve promise after YandexMetrica Init
          document.addEventListener(`yacounter${this.counterConfig.id}inited`, () => {
            resolve(this._counter);
          });
          this._counter = new Ya.Metrika2(this.counterConfig) as YandexMetrika;
        };
        if (typeof node !== 'undefined' && node.parentNode !== null) {
          node.parentNode.insertBefore(script, node);
        } else {
          document.appendChild(script);
        }
      });
    }
    return this._metricaInsert;
  }

  public async getClientID(): Promise<string> {
    const counter = await this.getCounter();
    return counter.getClientID();
  }

  public async setUserID(userId: string): Promise<void> {
    const counter = await this.getCounter();
    counter.setUserID(userId);
  }

  public async userParams(params: ym.UserParameters): Promise<void> {
    const counter = await this.getCounter();
    counter.userParams(params);
  }

  public async params(params: ym.UserParameters): Promise<void> {
    const counter = await this.getCounter();
    counter.userParams(params);
  }

  public async fireEvent(type: string, options: ym.VisitParameters = {}): Promise<void> {
    const counter = await this.getCounter();
    return new Promise<void>((resolve: () => void) => {
      counter.reachGoal(type, options, resolve, this);
    });
  }

  public async hit<CTX>(url: string, options: ym.HitOptions<CTX> = {}): Promise<any> {
    const counter = await this.getCounter();

    return new Promise<void>((resolve: () => void) => {
      options.callback = resolve;
      counter.hit(url, options);
    });
  }
}

interface InitParameters extends ym.InitParameters {
  id: number;
}

export interface YandexMetrika {
  reachGoal: (target: string, params?: ym.VisitParameters, callback?: () => void, ctx?: any) => void;
  addFileExtension: (extensions: string | string[]) => void;
  extLink: <CTX>(url: string, options?: ym.ExtLinkOptions<CTX>) => void;
  getClientID: () => string;
  setUserID: (userId: string) => void;
  notBounce: <CTX>(options: ym.NotBounceOptions<CTX>) => string;
  userParams: (parameters: ym.UserParameters) => void;
  replacePhones: () => void;
  hit: <CTX>(url: string, options?: ym.HitOptions<CTX>) => void;
}
