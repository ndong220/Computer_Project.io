import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserRightService {
  private listRight: string[] = [];
  private listRole: string[] = [];

  constructor() {}

  // Right
  add(right: string): void {
    this.listRight.push(right);
  }

  addMany(rights: [string]): void {
    this.listRight = this.listRight.concat(rights);
  }

  change(rights: [string]): void {
    this.listRight = Object.assign({}, rights);
  }

  check(right: string): boolean {
    return this.listRight.indexOf(right) > -1;
  }

  getAll(): string[] {
    return this.listRight;
  }

  deleteAll(): boolean {
    this.listRight = [];
    return true;
  }

  // Role
  addRole(role: string): void {
    this.listRole.push(role);
  }

  addManyRole(roles: [string]): void {
    this.listRole = this.listRole.concat(roles);
  }

  changeRole(roles: [string]): void {
    this.listRole = Object.assign({}, roles);
  }

  checkRole(role: string): boolean {
    return this.listRole.indexOf(role) > -1;
  }

  getAllRole(): string[] {
    return this.listRole;
  }

  deleteAllRole(): boolean {
    this.listRole = [];
    return true;
  }
}
