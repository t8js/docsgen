import { ContentInjectionMap } from "./ContentInjectionMap";
import type { Theme } from "./Theme";

export type EntryConfig = {
  id?: string;
  source?: string;
  dir?: string;
  baseColor?: string;
  theme?: Theme;
  name?: string;
  title?: string;
  htmlTitle?: string;
  description?: string;
  version?: string;
  repo?: string;
  npm?: string;
  /**
   * Target branch.
   * @example "gh-pages"
   */
  targetBranch?: string;
  /**
   * @defaultValue "main"
   */
  mainBranch?: string;
  /**
   * Main page root path.
   * @defaultValue "/"
   */
  root?: string;
  /**
   * Generated section content directory.
   * @defaultValue "x"
   */
  contentDir?: string;
  /** Whether to show all sections on a single page. */
  singlePage?: boolean;
  /** Backstory link URL to be added to the front page. */
  backstory?: string;
  /** URL of an HTML file inserted into the navigation bar. */
  nav?: string;
  /** Favicon URL. */
  favicon?: string;
  faviconType?: string;
  /** Scope URL. */
  scope?: string;
  /** Redirection URL. */
  redirect?: string;
  /** Whether to remove the GitHub Pages branch and quit. */
  remove?: boolean;
  /** Content of the './CNAME' file. */
  cname?: string;
  /**
   * As a boolean, it means whether to add the
   * '<package_name>.js.org' domain to the './CNAME' file.
   *
   * As a string, it sets the '<jsorg_value>.js.org' domain
   * to the './CNAME' file.
   */
  jsorg?: boolean | string;
  ymid?: number | string;
  append?: ContentInjectionMap<"head" | "body">;
};
