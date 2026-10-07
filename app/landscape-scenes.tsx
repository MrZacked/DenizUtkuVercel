import type { ReactNode } from "react";

function Pine({ x, y, scale, className, lean = false }: { x: number; y: number; scale: number; className: string; lean?: boolean }) {
  return (
    <path
      className={className}
      transform={`translate(${x} ${y}) scale(${scale})`}
      d={lean
        ? "M5 0 0 26-6 38 3 33-10 59-27 72-13 69-31 92-49 101-29 97-51 125-70 137-45 131-70 158-93 169-62 162-84 187-110 199-57 191-12 174-20 277-4 277 2 175 28 190 64 198 47 181 77 187 59 165 34 144 63 153 47 135 55 137 33 116 20 95 45 101 31 83 36 86 20 66 9 45 28 51 14 31 10 17Z"
        : "M0 0-5 18-13 32-7 30-20 49-29 57-18 55-35 76-45 84-26 82-47 108-62 116-39 114-64 143-78 151-54 148-79 174-94 182-64 177-85 198-101 208-49 200-8 179-11 275 5 275 4 180 29 195 74 206 56 188 78 194 61 174 38 152 70 161 50 140 60 144 39 120 25 99 52 107 36 87 45 90 24 65 12 44 30 52 15 29 8 14Z"}
    />
  );
}

function ForestPanels({ children, height = 780 }: { children: ReactNode; height?: number }) {
  return (
    <div className="forest-panels">
      <svg viewBox={`0 0 1600 ${height}`} preserveAspectRatio="xMinYMid slice" focusable="false">{children}</svg>
      <svg viewBox={`0 0 1600 ${height}`} preserveAspectRatio="xMaxYMid slice" focusable="false">{children}</svg>
    </div>
  );
}

function ForestGrove({ lower = false }: { lower?: boolean }) {
  return (
    <ForestPanels>
      <path className="forest-distant-trees" d={lower
        ? "M0 332c71-45 122-73 188-40 63 32 73 103 139 126l82 13-94 73-119 83L0 673Zm1600-36c-71-5-123 52-159 102-31 44-78 82-147 99l58 94 248 97Z"
        : "M0 140c82-18 144 25 175 90 22 47 81 55 124 78l-15 142L0 574Zm1600 12c-91-35-146 21-179 83-27 52-82 56-143 84l27 159 295 28Z"} />
      <Pine className="forest-trees" x={38} y={lower ? 110 : 30} scale={1.45} lean />
      <Pine className="forest-trees" x={183} y={lower ? 250 : 165} scale={1.1} />
      <Pine className="forest-trees" x={290} y={lower ? 368 : 300} scale={0.72} lean />
      <Pine className="forest-trees" x={1328} y={lower ? 330 : 292} scale={0.95} />
      <Pine className="forest-trees" x={1447} y={lower ? 148 : 112} scale={1.55} lean />
      <Pine className="forest-trees" x={1580} y={lower ? 36 : 2} scale={2} />
      <path className="forest-bank" d="M0 578c137-48 259-5 354 66l174 65-97 71H0Zm1600-42c-107 7-185 70-271 102l-199 89 36 53h434Z" />
    </ForestPanels>
  );
}

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
        </svg>
      </div>
      <svg className="valley-ground" viewBox="0 0 1600 160" preserveAspectRatio="none" focusable="false">
        <path d="M0 51 183 76l151-37 206 53 186-22 201 28 176-48 233 9 264-45v146H0Z" />
      </svg>
    </div>
  );
}



export function ExperienceTerrain() {
  return (
    <div className="experience-terrain" aria-hidden="true">
      <div className="experience-terrain-panel experience-terrain-continuous">
        <ForestPanels height={1600}>
          <path className="terrain-ridge" d="M0 78c112 58 165 194 150 340-13 125 71 228 144 330 81 112 85 216 18 343-40 76-51 159 18 247l70 262H0Zm1600-78c-74 67-132 151-122 271 8 105-78 168-109 268-39 126 20 237-22 354-32 89-96 165-82 270 16 112-72 240-122 437h457Z" />
          <path className="terrain-slope" d="M0 400c94 48 116 144 80 235-40 101 47 203 76 300 28 99-14 199 5 288 17 80 105 148 119 240l-26 137H0Zm1600-161c-51 122-37 254-97 357-55 95-27 190-39 286-18 136-90 239-78 353 8 89-24 241-89 365h303Z" />
          <path className="terrain-contour" d="M1539 145c-61 112-32 168-88 250s-59 167-39 246c21 84-37 179-43 260s-46 179-64 244m-1271-650c107 86 45 164 67 257s107 151 89 256m1314 80c-30 95-49 168-87 257" />
        </ForestPanels>
      </div>
    </div>
  );
}

export function ForestEdge() {
  return (
    <div className="forest-edge" aria-hidden="true">
      <div className="forest-layer">
        <ForestPanels>
          <path className="forest-distant-trees" d="M0 158c109-29 197 10 234 91 29 64 95 89 193 107l-98 134L0 544Zm1600-30c-116 2-187 76-219 155-25 63-85 68-176 99l106 151 289-59Z" />
          <Pine className="forest-trees" x={43} y={53} scale={1.8} lean />
          <Pine className="forest-trees" x={180} y={171} scale={1.3} />
          <Pine className="forest-trees" x={307} y={266} scale={0.95} lean />
          <Pine className="forest-trees" x={1298} y={255} scale={0.85} />
          <Pine className="forest-trees" x={1421} y={135} scale={1.4} lean />
          <Pine className="forest-trees" x={1556} y={39} scale={1.95} />
        </ForestPanels>
      </div>
      <div className="forest-depth forest-depth-back">
        <div className="forest-grove forest-grove-upper"><ForestGrove /></div>
        <div className="forest-grove forest-grove-lower"><ForestGrove lower /></div>
      </div>
      <div className="forest-depth forest-depth-front">
        <div className="forest-grove forest-grove-middle">
          <ForestPanels>
            <Pine className="forest-near-trees" x={-13} y={37} scale={2.6} />
            <Pine className="forest-near-trees" x={1620} y={91} scale={2.3} lean />
            <path className="forest-bough" d="M0 218c76 30 94 38 168 47l-14 12-93-14 52 27-10 8-103-40Zm1600 124-167 61 73-5-40 25 7 11 127-52Z" />
          </ForestPanels>
        </div>
      </div>
    </div>
  );
}

export function CaveScene() {
  return (
    <div className="cave-scene" aria-hidden="true">
      <div className="cave-mouth">
        <svg viewBox="0 0 1600 640" preserveAspectRatio="xMidYMid slice" focusable="false">
          <path className="forest-ground" d="M0 145h1600v141l-158-21-137 30-147-19-192 40-134-19-141 17-148 5-137-39-182-13C138 242 97 233 0 256Z" />
        </svg>
        <div className="cave-forest">
          <ForestPanels height={640}>
            <Pine className="forest-threshold-trees" x={-4} y={4} scale={1.1} lean />
            <Pine className="forest-threshold-trees" x={119} y={105} scale={0.72} />
            <Pine className="forest-threshold-trees" x={260} y={180} scale={0.38} lean />
            <Pine className="forest-threshold-trees" x={1338} y={143} scale={0.62} />
            <Pine className="forest-threshold-trees" x={1474} y={44} scale={1.02} lean />
            <Pine className="forest-threshold-trees" x={1615} y={-12} scale={1.26} />
          </ForestPanels>
        </div>
        <svg viewBox="0 0 1600 640" preserveAspectRatio="xMidYMid slice" focusable="false">
          <path className="cave-soil" d="M0 256c97-23 138-14 224 11l182 13 137 39 148-5 141-17 134 19 192-40 147 19 137-30 158 21v354H0Z" />
          <path className="cave-stratum" d="m0 303 128-12 94 32 184-1 153 34 132-6 165-14 111 22 191-31 143 11 130-23 169 33v292H0Z" />
          <path className="cave-roof" d="m0 359 93-10 135 46 173-10 121 49 173-19 138-30 140 39 179-40 144 14 131-35 173 30v247H0Z" />
          <path className="cave-root" d="m123 269 12 67-15 40 8 51m6-82 29 34 15 44m-44-78-27 35-4 40m1187-145-12 69 13 48-23 57m13-78-31 19-10 42m239-163-26 61 3 53-18 34" />
          <path className="cave-root-fine" d="m125 385-24 29-9 32m72-50 24 20 4 22m1137-27 27 9 11 33m154-63-21 10-12 30" />
          <path className="cave-root-fine" d="m650 320 5 32-18 34 5 26m13-60 18 17 10 30m192-94-12 46 19 35-8 36" />
        </svg>
      </div>
      <div className="cave-layer cave-layer-back">
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMaxYMid slice" focusable="false">
          <path className="cave-distant" d="M729 0h871v900H736l52-175 3-156 57-165 118-138 128-52 115 4 119 56 93 109 31 174-12 164 60 179h-107l-82-94-188-22-137 45-232-41-90 84Z" />
          <path className="cave-facet" d="m729 0 191 121 125-43 141 42 131-26 125 49 91-34 67 94V0Zm6 900 53-175 3-156 57-165 118-138-16 132-72 124 9 160-58 112-12 106Z" />
          <path className="cave-rock" d="m950 398 89-139 139-52 119 8 112 50 12 82-99-34-81-33-101 40-83 94-54 131-16 174-60 87 34-164-26-120Zm469-78 53 63 31 174-12 164 60 179h49V246l-158-103-79 122Z" />
          <path className="cave-facet" d="m1056 184 60 29 38 129 19-111 38 18 38 85 8-97 67 44 27 101 8-106 64 71-47-168-103-74-115-19Zm407 382-82 125 15 143 86 66 69-73-60-106Z" />
          <path className="cave-near" d="m1417 900-61-90-182-13-124 27-127-19 37-66 108 21 95-33 123 24 79-7 52 116Z" />
          <path className="cave-seam" d="m920 121-97 57-36 151-47 31m305-282 49 64-28 54 41 66m79-142 33 34-24 69 48 75m174-147-35 146 43 144-39 161 14 132m-423-259-47 73-8 174-37 93" />
          <path className="cave-striation" d="m805 236 76-61 74-27m-152 139 44-25 33-12m504-77 63 42 38 38m-29 22 49 61m-11 103 33 39-13 94m-419-159-38 60-12 92m-54 37-15 78" />
          <path className="cave-water" d="m915 804 124-20 136 23 167-17 81 30 120 80H784Z" />
          <path className="cave-water-shadow" d="m785 900 251-49 139 16 158-9 211 42Z" />
          <path className="cave-water-line" d="m1044 826 103-6 65 3m-249 31 68-4m167-15 62-3 69 5m-210 32 78 3 61-6m-416 26 125-9 111 4m105 0 53-2" />
        </svg>
      </div>
      <div className="cave-layer cave-layer-front">
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMaxYMid slice" focusable="false">
          <path className="cave-near" d="M0 56 37 149l-12 70 39 114-24 120 45 113-37 199 43 135H0Zm1600 28-63 131-23 124 25 170-37 115 9 97-68 179h157Z" />
          <path className="cave-rock" d="m1427 900 18-110 22-52 15 29 9 108 30 25Zm121 0-1-271 13-67 16 74 9 229 15 35Z" />
          <path className="cave-facet" d="m0 566 47 71-12 129 24 74-11 60H0Zm1537-351 63-131v202l-56 115-6-62Z" />
          <path className="cave-seam" d="m26 370 18 61-21 72m1545 27-16 65 13 53" />
        </svg>
      </div>
    </div>
  );
}

export function CaveFloor() {
  return (
    <div className="cave-floor" aria-hidden="true">
      <svg viewBox="0 0 1600 380" preserveAspectRatio="none" focusable="false">
        <path className="cave-distant" d="M0 283 197 263l169 29 258-20 229 36 204-49 177 25 211-47 155 18v125H0Z" />
        <path className="cave-rock" d="m1203 380 30-128 17-25 22 89 26 64Zm178 0 27-196 20-36 23 42 36 190Z" />
        <path className="cave-near" d="M0 341 197 314l147 34 273-19 173 23 258-27 221 23 174-35 157 28v39H0Z" />
      </svg>
    </div>
  );
}
