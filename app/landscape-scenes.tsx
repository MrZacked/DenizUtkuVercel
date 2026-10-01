export function ValleyScene() {
  return (
    <div className="valley-scene" aria-hidden="true">
      <div className="valley-layer valley-layer-back">
        <svg viewBox="0 0 1600 760" preserveAspectRatio="none" focusable="false">
          <path className="landscape-distant" d="M0 170 152 155 310 210 452 188 612 267 782 288 942 248 1092 225 1218 141 1373 159 1510 88 1600 126V760H0Z" />
          <path className="landscape-middle" d="M0 245 156 232 315 286 458 268 645 336 794 352 981 308 1128 299 1259 230 1394 252 1514 173 1600 205V760H0Z" />
        </svg>
      </div>
      <div className="valley-layer valley-layer-front">
        <svg viewBox="0 0 1600 760" preserveAspectRatio="none" focusable="false">
          <path className="landscape-stone" d="m1538 116 62 30v614h-178l49-133-37-85 72-90-30-93 49-113-29-61Z" />
          <path className="landscape-contour" d="m1600 218-51 54 15 61m36 71-65 53 18 41m47 67-69 39 13 44" />
          <path className="landscape-foreground" d="M0 415 152 387 310 426 442 401 623 446 777 454 968 420 1124 434 1274 346 1416 351 1528 277 1600 300V760H0Z" />
          <path className="landscape-foreground" d="m1438 415-16-65-17 65h9v30h16v-30Zm-1241 98-18-78-19 78h10v34h17v-34Z" />
        </svg>
      </div>
      <svg className="valley-ground" viewBox="0 0 1600 160" preserveAspectRatio="none" focusable="false">
        <path d="M0 51 183 76l151-37 206 53 186-22 201 28 176-48 233 9 264-45v146H0Z" />
      </svg>
    </div>
  );
}

export function ForestEdge() {
  return (
    <div className="forest-edge" aria-hidden="true">
      <div className="forest-layer">
        <svg viewBox="0 0 1600 360" preserveAspectRatio="none" focusable="false">
          <path className="forest-ground" d="M0 30 164 72l223-28 214 31 207-49 211 27 242-25 169 31 170-40v341H0Z" />
          <path className="forest-trees" d="m0 76 30-76 31 76H43v24h33l24-64 25 64h-15v49h32l-38-19H0Zm1514 119h28v-39h-20l35-98 36 98h-21v39h28v86h-86ZM15 192l16-49 17 49H37v24H25v-24Zm1464-82 23-62 24 62h-16v34h-17v-34Z" />
        </svg>
      </div>
    </div>
  );
}

export function WoodlandScene() {
  return (
    <div className="woodland-scene" aria-hidden="true">
      <div className="woodland-layer woodland-layer-back">
        <svg viewBox="0 0 1600 780" preserveAspectRatio="xMaxYMax slice" focusable="false">
          <path className="landscape-distant" d="m682 494 183-169 141 25 153-153 139 86 154-163 148 113v547H682Z" />
          <path className="landscape-middle" d="m598 591 219-123 170 67 167-145 181 72 130-144 135 74v388H598Z" />
          <path className="woodland-trail" d="m1489 289-99 183-164 51 39 96-157 74 37 87h46l-25-76 163-73-35-103 151-40 94-199Z" />
        </svg>
      </div>
      <div className="woodland-layer woodland-layer-front">
        <svg viewBox="0 0 1600 780" preserveAspectRatio="xMaxYMax slice" focusable="false">
          <path className="landscape-foreground" d="m0 780 518-3 233-95 230 35 147-75 169 24 182-95 121 60v149Z" />
          <path className="landscape-foreground" d="m1509 565-59-180-59 180h37v116h44V565Zm-162 39-35-113-37 113h24v93h25v-93Zm209-128-35-101-36 101h22v70h26v-70Z" />
        </svg>
      </div>
    </div>
  );
}
