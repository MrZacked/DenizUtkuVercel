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
        <div className="forest-trunks">
          <ForestPanels height={1000}>
            <path className="forest-distant-trees" d="M0 174c26 142 25 269 44 413 9 66 20 134 46 207l-4 82H0Zm1600-23c-31 153-23 270-42 405-14 99-16 166-46 251l12 69h76Z" />
            <path className="forest-trunk" d="M21 243c16 150 9 293 26 443 6 51 10 88 23 119l39 40-43-11-24-28-13 29-28 8 18-42c-9-46-9-97-13-153L0 243Zm1571-45c-26 171-15 311-30 481-4 40-12 79-26 109l-32 49 34-14 19-28 9 32 32 15-22-49c14-103 4-166 8-267 3-103 3-216 29-328Z" />
            <path className="forest-bough" d="m34 473 51-58 31-42-12-8-33 39-43 32Zm1553 41-52-50-26-48-13 8 25 52 59 61Z" />
            <path className="forest-bark" d="M32 567c5 68 2 118 9 163m1512-108c-6 48-1 88-12 126" />
            <path className="forest-bank" d="M0 822c67-41 101-12 171-40 75-30 118 38 211 17l38 201H0Zm1600-53c-96 1-152 40-233 19-56-14-112 43-178 47l-29 165h440Z" />
          </ForestPanels>
        </div>
        <div className="forest-slope">
          <ForestPanels height={1600}>
            <path className="terrain-ridge" d="M0 58 88 119 131 249 225 345 203 461 278 598 239 726 346 855 322 984 410 1138 347 1270 474 1453 508 1600H0Zm1600-25-85 79-18 138-93 123 36 113-84 128 24 151-90 112 31 147-105 144 19 138-114 175-28 182h507Z" />
            <path className="terrain-slope" d="M0 242 52 317 91 496 148 548 132 693 197 781 172 946 264 1077 209 1214 316 1384 305 1600H0Zm1600-119-36 201-56 112 17 160-78 107 28 178-80 121 18 145-79 171 29 123-91 143-17 138h345Z" />
            <path className="terrain-contour" d="m61 394 58 139-16 137 57 124m1345-442-63 139 22 156-57 117m-1154 250 63 104-31 120 73 143m1078-365-58 117 15 144-70 142" />
          </ForestPanels>
        </div>
      </div>
      <div className="forest-depth forest-depth-front">
        <div className="forest-floor-transition">
          <ForestPanels height={900}>
            <path className="forest-bank" d="M0 371c76 139 108 207 238 257 98 38 187 137 232 272H0Zm1600-226c-102 136-62 301-176 421-73 78-164 164-194 334h370Z" />
            <path className="forest-floor" d="M0 683c142-5 159 113 339 165l85 52H0Zm1600-34c-140 27-146 124-289 194l-106 57h395Z" />
            <path className="forest-root" d="M65 562c12 62 67 96 88 135s24 94 70 112m-76-124c47 8 80 22 103 58m-74-18c-11 47-9 84 15 132m1307-438c-73 57-39 104-91 160s-96 111-112 181m105-169c-68 0-91 31-123 62m90-17c27 35 5 70-15 111" />
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
          <path className="forest-ground" d="M0 112c168 45 257 63 390 32 211-49 290 31 488 17 251-19 439-98 722-83v562H0Z" />
          <path className="cave-soil" d="M0 198c123 16 219 77 364 43 180-41 265 62 449 42 255-29 441-123 787-71v428H0Z" />
          <path className="cave-stratum" d="M0 244c128 17 187 91 330 69 136-22 224 57 377 32 147-24 203 32 333-13 157-55 259-120 560-64v372H0Z" />
          <path className="cave-roof" d="M0 307c61-7 76 84 149 70 64-12 92 37 169 21 117-25 169 72 292 44 109-25 134 31 232 7 84-21 116 13 212-26 124-51 173-101 269-78 91 22 186-48 277-1v296H0Z" />
          <path className="cave-root" d="M22 258c-9 47 13 70 5 96s-20 39-17 68m15-73c17 14 16 41 31 59m1300-146c17 44-21 77-24 117s-32 64-26 91m28-77c-41 15-61 47-69 78m183-151c-43 36-15 66-38 113" />
          <path className="cave-root-fine" d="M54 400c-15 13-13 26-18 42m1239-34c-29 11-24 36-42 53m200-77c18 8 27 26 25 48m-791-92c11 27 0 46 12 72m-1-28c19 2 28 18 31 36" />
        </svg>
      </div>
      <div className="cave-layer cave-layer-back">
        <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMaxYMid slice" focusable="false">
          <defs>
            <linearGradient id="cavern-light" x1="0" y1="0" x2="0.25" y2="1">
              <stop stopColor="var(--cave-glow)" stopOpacity="0.3" />
              <stop offset="1" stopColor="var(--cave-glow)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cavern-distance" x1="0" y1="0" x2="0.2" y2="1">
              <stop stopColor="var(--cave-opening)" />
              <stop offset="0.5" stopColor="var(--cave-opening)" stopOpacity="0.65" />
              <stop offset="1" stopColor="var(--cave-distant)" />
            </linearGradient>
          </defs>
          <path className="cave-distant" d="M658 0h942v1000H690c-3-151 31-275 8-406-35-199 21-333 142-428C895 122 941 46 1010 0Z" />
          <path className="cave-shadow" d="M786 258c118-103 203-43 310-86 138-55 303 64 399 209 84 128 51 277 105 415v204H783c26-88 92-177 45-306-55-150-140-302-42-436Z" />
          <path className="cave-rock" d="M712 0c82 85 64 183 191 210 91 19 113 80 212 49 78-25 116 55 185 33 147-47 180 42 300 150V0Zm36 1000c38-97 113-163 83-254-39-123-97-208-49-346 27-77 17-158 67-251-122 63-160 190-131 336 24 122-35 203-35 317-1 75-17 139-52 198Z" />
          <path className="cave-facet" d="M846 123c36 71 59 93 129 93 86 0 103 75 177 38 96-48 105 48 185 8 87-44 125 20 195 88-76-140-171-226-295-202-65 12-87-28-160-13-79 16-119-36-170-20Zm-80 343c-33 100 23 192 35 288 12 97-33 158-53 246h52c16-68 46-149 29-231-24-114-72-172-37-313Z" />
          <path className="cave-opening-rim" d="M1151 316c48-27 79-8 101 30 21 36 7 59 27 97 19 36 45 50 35 81-11 39-4 82-35 105-23 17-64-12-96-10-29 2-53-18-48-53 6-42-14-52-19-90-6-47 10-77 13-111 2-23 6-39 22-49Z" />
          <path className="cave-opening" d="M1165 347c32-15 49 4 66 26 16 22 2 53 23 88 15 25 41 42 30 65-17 37-1 60-30 72-24 10-45-9-66-8-27 1-24-23-20-49 5-35-15-42-19-68-6-37 10-57 8-83-2-21-3-36 8-43Z" />
          <path className="cave-opening-rock" d="M1154 509c15 2 9 30 24 32 25 3 19 24 39 17 20-8 20 25 38 16 14-8 18-23 27-41l-11 70c-45 8-68-1-107-12Z" />
          <path className="cave-light-shaft" d="M1167 542c34 27 61 18 103-10l162 363c-107 40-281 60-368 3Z" />
          <path className="cave-rock" d="M1600 201c-83 70-81 163-119 250-41 94 24 146-5 240-24 78 55 176 63 309h61Z" />
          <path className="cave-near" d="M0 925c251 22 415-11 647 29 129 22 224-10 350-22 178-17 321-50 603-19v87H0Z" />
          <path className="cave-water" d="M839 903c102-17 149-32 244-9 92 22 170-27 275-9l176 41c-159-12-245 29-372 23-153-7-249 7-354-8Z" />
          <path className="cave-water-shadow" d="M892 944c126-19 204-6 320-11 79-3 149-16 222-12l100 5c-110 6-179 34-272 23-117-12-209 5-370-5Z" />
          <path className="cave-seam" d="M790 59c39 56 30 100 83 124m143 35c58 13 82 56 111 44m245-59c49 31 53 75 90 84m-678 278c-21 77 22 150 16 235m-59 73c-8 36-21 69-34 101" />
          <path className="cave-striation" d="M886 179c44 11 62 1 105 27m74 3c37 23 64 27 96 11m210 0c35 14 42 39 72 52m48 248c-16 25-20 49-14 82" />
          <path className="cave-water-line" d="M1009 913c45-4 77 2 115-1m43 17c42 2 69-5 112-7m-335 13 50-2m315-15 52 1" />
        </svg>
      </div>
      <div className="cave-layer cave-layer-front">
        <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMaxYMid slice" focusable="false">
          <path className="cave-near" d="M0 164c44 35 13 98 49 145 34 45-26 111-3 176 18 54-19 113 4 154 34 62-9 124 1 183 12 72 40 124 32 178H0Zm1600-64c-66 55-28 123-82 200-48 68-11 127-20 189-14 98 55 140 37 217-18 80 32 137-13 218l-37 76h115Z" />
          <path className="cave-facet" d="M1600 206c-40 49-51 87-55 138-5 62-35 98-8 151 13 26 9 55 19 87-41-71-61-129-38-206 23-74 22-106 82-170Z" />
        </svg>
      </div>
    </div>
  );
}

export function CaveFloor() {
  return (
    <div className="cave-floor" aria-hidden="true">
      <svg viewBox="0 0 1600 380" preserveAspectRatio="xMidYMax slice" focusable="false">
        <path className="cave-distant" d="M0 236c219-12 343 30 505 12 161-18 230 42 410 19 167-22 425-92 685-36v149H0Z" />
        <path className="cave-water" d="M765 286c114-17 175-4 271-14 149-15 295-9 437 19-168-3-248 33-429 23-103-6-175 7-279-28Z" />
        <path className="cave-rock" d="M1504 380c-40-31-20-54-48-78-42-35-54-4-84-34-21-21-21-43-52-35-28 7-34 44-60 59-20 12-31 45-46 88Z" />
        <path className="cave-near" d="M0 317c133-32 274 18 400 4 170-18 219 34 386 18 260-25 448 18 674-20l140 33v28H0Z" />
      </svg>
    </div>
  );
}
