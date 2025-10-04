import React from "react";
import AmenitiesSection from "./AmenitiesSection";

// 🔹 PNG Icons
import foodAvailable from "../../assets/PG/icons/dinner.png";
import meals from "../../assets/PG/icons/meals.png";
import fridge from "../../assets/PG/icons/fridge.png";
import foodCharges from "../../assets/PG/icons/cutlery.png";
import deposit from "../../assets/PG/icons/deposit.png";
// 🔹 SVG Icons for Other Charges and House Rules

import audio from "../../assets/PG/home-rules/audio.png";
import gateClose from "../../assets/PG/home-rules/close.png";
import notice from "../../assets/PG/home-rules/file.png";
import gender from "../../assets/PG/home-rules/gender.png";
import party from "../../assets/PG/home-rules/party.png";
import smoke from "../../assets/PG/home-rules/smoke.png";
import nonVeg from "../../assets/PG/home-rules/turkey.png";
import visitor from "../../assets/PG/home-rules/user.png";
import wine from "../../assets/PG/home-rules/wine-glass.png";

const svgIcons = {
  deposit: deposit,
  laundry: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
      fill="#E34F4F"
      className="w-6 h-6 sm:w-8 sm:h-8"
    >
      <path d="M320.2 176c44.2 0 80-35.8 80-80h53.5c17 0 33.3 6.7 45.3 18.7l118.6 118.7c12.5 12.5 12.5 32.8 0 45.3l-50.7 50.7c-12.5 12.5-32.8 12.5-45.3 0l-41.4-41.4v224c0 35.3-28.7 64-64 64H224.2c-35.3 0-64-28.7-64-64v-224l-41.4 41.4c-12.5 12.5-32.8 12.5-45.3 0l-50.7-50.7c-12.5-12.5-12.5-32.8 0-45.3l118.6-118.7c12-12 28.3-18.7 45.3-18.7h53.5c0 44.2 35.8 80 80 80z" />
    </svg>
  ),
  visitor: visitor,
  music: audio,
  ban: wine,
  nonVeg: nonVeg,
  smoke: smoke,
  party: party,
  notice: notice,
  gender: gender,
  gateClose: gateClose,
};

const AmenitiesContainer = () => {
  return (
    <section className="relative mx-auto max-w-[95%] py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8">
      <AmenitiesSection
        title="Food and Kitchen"
        items={[
          {
            icon: foodAvailable,
            label: "Meals Provided",
            status: "yes",
          },
          {
            icon: meals,
            label: "Kitchen Access",
            status: "yes",
          },
          {
            icon: fridge,
            label: "Fridge",
            status: "yes",
          },
          {
            icon: foodCharges,
            label: "Food Charges Apply",
            status: "yes",
          },
        ]}
      />

      <AmenitiesSection
        title="Other Charges"
        items={[
          {
            icon: svgIcons.deposit,
            label: "Deposit Amount ₹11,680",
            status: "yes",
          },
          {
            icon: svgIcons.laundry,
            label: "Laundry Available",
            status: "yes",
          },
        ]}
      />

      <AmenitiesSection
        title="House Rules"
        items={[
          {
            icon: svgIcons.visitor,
            label: "Visitor Entry",
            status: "yes",
          },
          {
            icon: svgIcons.music,
            label: "Loud Music",
            status: "yes",
          },
          {
            icon: svgIcons.ban,
            label: "Drinking",
            status: "no",
          },
          {
            icon: svgIcons.nonVeg,
            label: "Non-veg Food",
            status: "yes",
          },
          {
            icon: svgIcons.smoke,
            label: "Smoking",
            status: "no",
          },
          {
            icon: svgIcons.party,
            label: "Party ",
            status: "no",
          },
          {
            icon: svgIcons.notice,
            label: "Notice Period",
            status: "yes",
          },
          {
            icon: svgIcons.gender,
            label: "Opposite Gender",
            status: "yes",
          },
          {
            icon: svgIcons.gateClose,
            label: "Gate Closing Time",
            status: "yes",
          },
        ]}
      />
    </section>
  );
};

export default AmenitiesContainer;
