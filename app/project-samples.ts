import results from "./detection-results.json";
import type { DetectionExample } from "./detection-gallery";
import type { ColorExample } from "./color-gallery";

const cat = {
  author: "Jakub Hałun",
  source: "https://commons.wikimedia.org/wiki/File:Cat_on_a_bench_near_Sultanahmet_Meydan%C4%B1,_Istanbul,_20260605_0902_0926.jpg",
  license: "CC BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
};

const car = {
  author: "Jackie Alexander",
  source: "https://unsplash.com/photos/car-parked-on-roadside-during-sunset-with-green-fields-rtkzm5Bkb9Q",
  license: "Unsplash License",
  licenseUrl: "https://unsplash.com/license",
};

const horse = {
  author: "Hayden Soloviev",
  source: "https://commons.wikimedia.org/wiki/File:Haflinger_horse_in_a_field_on_%C3%8Ele_d%27Orl%C3%A9ans.jpg",
  license: "CC BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
};

const detectionPhotos = [
  { id: "cat", title: "A cat in Istanbul", src: "/work/detection-cat.webp", alt: "Calico cat resting on a wooden bench in Istanbul", photo: cat },
  { id: "car", title: "A road in Tasmania", src: "/work/detection-car.webp", alt: "Car parked beside a country road and green fields at sunset", photo: car },
  { id: "horse", title: "A horse in the field", src: "/work/detection-horse.webp", alt: "Chestnut Haflinger horse grazing in a green field", photo: horse },
];

export const detectionExamples: readonly DetectionExample[] = detectionPhotos.map((photo) => {
  const result = results.find((entry) => entry.id === photo.id);
  if (!result) throw new Error(`Missing detection results for ${photo.id}`);
  return { ...photo, boxes: result.boxes };
});

export const colorExamples: readonly ColorExample[] = [
  {
    id: "cabin",
    title: "A cabin by the lake",
    input: "/work/color-cabin-input.webp",
    output: "/work/color-cabin-output.webp",
    inputAlt: "Grayscale photo of a wooden cabin beside a lake and trees",
    outputAlt: "The same lakeside cabin with colors estimated by the model",
    photo: {
      author: "Larry D. Moore",
      source: "https://commons.wikimedia.org/wiki/File:Lake_Livingston_State_Park_Cabin.jpg",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    },
  },
  {
    id: "harbour",
    title: "An evening in Kyrenia",
    input: "/work/color-harbour-input.webp",
    output: "/work/color-harbour-output.webp",
    inputAlt: "Grayscale photo of boats and waterfront buildings in Kyrenia harbour",
    outputAlt: "The same Kyrenia harbour with colors estimated by the model",
    photo: {
      title: "Kyrenia Harbour - sunset",
      author: "Mike Finn",
      source: "https://commons.wikimedia.org/wiki/File:Kyrenia_Harbour_-_sunset_(15894792481).jpg",
      license: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    },
  },
  {
    id: "porto",
    title: "A street in Porto",
    input: "/work/color-porto-input.webp",
    output: "/work/color-porto-output.webp",
    inputAlt: "Grayscale photo of a cobbled street between old buildings in Porto",
    outputAlt: "The same Porto street with colors estimated by the model",
    photo: {
      title: "Porto street scene",
      author: "Bex Walton",
      source: "https://commons.wikimedia.org/wiki/File:Porto_street_scene_(51707325059).jpg",
      license: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    },
  },
];
