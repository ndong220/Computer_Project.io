export class ButtonModel {
  title?: string | undefined;
  titlei18n?: string | undefined;
  visible = true;
  enable = true;
  grandAccess = true;
  click!: ($event: any) => any;
}
