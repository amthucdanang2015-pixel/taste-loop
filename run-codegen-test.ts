import { GALLERY_CODEGENS } from "./src/components/anim/galleryCodegens";
import fs from "fs";

const code = GALLERY_CODEGENS["magnetic"]({ cardWidth: 100, cardHeight: 150 }, { name: "MagneticCarouselDemo" });
fs.writeFileSync("src/components/anim/DemoCP.tsx", code);
