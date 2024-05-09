import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { ResearchComponent } from "./pages/home/research/research.component";
import { GuidePreferenceComponent } from "./pages/home/research/guide-preference/guide-preference.component";
import { ChooseGuideComponent } from "./pages/home/research/guide-preference/choose-guide/choose-guide.component";
import { AllocateGuideComponent } from "./pages/home/research/guide-preference/allocate-guide/allocate-guide.component";
import { AllocateCoGuideComponent } from "./pages/home/research/guide-preference/allocate-co-guide/allocate-co-guide.component";

export const routes: Routes = [
  {
    path: "",
    title: "home",
    component: HomeComponent,
  },
  {
    path: "research",
    title: "Research",
    component: ResearchComponent,
  },
  { path: "research/guide-preference", title: "Guide Preference", component: GuidePreferenceComponent },
  { path: "research/guide-preference/choose", title: "Choose Guide", component: ChooseGuideComponent },
  { path: "research/guide-preference/allocate", title: "Allocate Guide", component: AllocateGuideComponent },
  { path: "research/guide-preference/allocate-co-guide", title: "Allocate Co-Guide", component: AllocateCoGuideComponent },

];
