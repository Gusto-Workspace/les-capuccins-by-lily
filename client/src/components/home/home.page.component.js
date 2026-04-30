import { useContext } from "react";
import { GlobalContext } from "@/contexts/global.context";
import {
  getHomeMenuPreview,
  getRestaurantBrandParts,
  getRestaurantDisplayName,
} from "@/_assets/utils/site-display.utils";
import HeroHomeSection from "./sections/hero.home.section";
import HistoryHomeSection from "./sections/history.home.section";
import SpecialtiesHomeSection from "./sections/specialties.home.section";
import MenuPreviewHomeSection from "./sections/menu-preview.home.section";
import ReservationHomeSection from "./sections/reservation.home.section";
import TakeawayHomeSection from "./sections/takeaway.home.section";

export default function HomePageComponent({ heroRef = null }) {
  const { restaurantContext } = useContext(GlobalContext);
  const restaurantData = restaurantContext?.restaurantData;
  const brand = getRestaurantBrandParts();
  const restaurantName = getRestaurantDisplayName();
  const menuColumns = getHomeMenuPreview(restaurantData, {
    limitCategories: 3,
    limitItems: 3,
  }).map((category) => ({
    ...category,
    items: category.items.slice(0, 5),
  }));

  return (
    <div className="overflow-x-hidden">
      <HeroHomeSection
        heroRef={heroRef}
        brandMain={brand.main}
        brandAccent={brand.accent}
      />
      <HistoryHomeSection restaurantName={restaurantName} />
      <SpecialtiesHomeSection />
      <MenuPreviewHomeSection menuColumns={menuColumns} />
      <ReservationHomeSection restaurantData={restaurantData} />
      <TakeawayHomeSection />
    </div>
  );
}
