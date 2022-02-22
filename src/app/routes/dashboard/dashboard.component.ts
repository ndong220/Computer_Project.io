import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { environment } from '@env/environment';
import { dashboardRouter, ListLabelMonth } from '@util';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/app/services/api/dashboard.service';
import { ProductService } from 'src/app/services/computer-management/product/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public barChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          return (
            'Doanh thu: ' +
            Number(tooltipItem.yLabel)
              .toFixed(0)
              .replace(/./g, function (c, i, a) {
                return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c;
              }) +
            ' VNĐ'
          );
        },
      },
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartLabelsMonth: Label[] = ListLabelMonth;
  public barChartLabelsYear: Label[] = [];
  public barChartLabelsQuater: Label[] = ['Quý I', 'Quý II', 'Quý III', 'Quý IV'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartDataMonth: ChartDataSets[] = [{ data: [], label: 'Doanh thu (VNĐ)' }];
  public barChartDataYear: ChartDataSets[] = [];
  public barChartDataQuater: ChartDataSets[] = [];
  visitWebsite = 0;
  visitProd = 0;
  orderCount = 0;
  currentYear;
  yearSelect = new Date().getFullYear().toString();
  yearSelectQuater = new Date().getFullYear().toString();
  orderCountToday = 0;
  orderCountMonth = 0;
  orderRevoked = 0;
  grandTotal = 0;
  baseFile = environment.BASE_FILE_URL;
  grandTotalRecived = 0;
  orderCountRecived = 0;
  visitWebsiteToday = 0;
  visitProdToday = 0;
  listProd: any[] = [];
  prodTopFive: any[] = [];
  prodOrderFive: any[] = [];
  constructor(private dashboardService: DashboardService, private prodService: ProductService, private cdf: ChangeDetectorRef) {
    this.currentYear = new Date().getFullYear();
    const list = JSON.parse(localStorage.getItem('visit-count') || '[]');
    if (list) {
      this.visitWebsite = list.visitWebsite;
      this.visitWebsiteToday = list.visitWebsiteToday;
    }
    var x = this.getProduct();
    this.getRpMonth(this.yearSelect);
  }
  listColor: any[] = [];
  getProduct(): Subscription {
    let promise = this.prodService.getAll().subscribe((res) => {
      if (res.code === 200) {
        this.listProd = res.data.data;
        if (res.data.data) {
          this.listProd.sort((a: any, b: any) => (b.visitCount > a.visitCount ? 1 : -1));
          this.prodTopFive = [...this.listProd.slice(0, 5)];
          this.getDashboardReport(this.listProd);
          this.cdf.detectChanges();
        }
      }
      this.changeYearQuater(this.yearSelectQuater);
    });
    return promise;
  }
  getRpMonth(year: any) {
    this.dashboardService.getRpMonth(year).subscribe((res) => {
      let data: any[] = [];
      for (let index = 0; index < 12; index++) {
        data.push(0);
        this.listColor.push('#3282B8');
      }
      res.reportMonthModel.map((x) => {
        data[x.month - 1] = x.total;
      });
      this.barChartDataMonth = [{ data: data, label: 'Doanh thu (VNĐ)', backgroundColor: this.listColor }];
    });
  }
  getDashboardReport(listProd: any[] = []) {
    this.dashboardService.getAll().subscribe((res) => {
      if (res) {
        const rs = res.orderReport;
        this.orderCount = rs.orderReceived;
        this.orderCountRecived = rs.orderDelivered;
        this.orderRevoked = rs.orderCancelled;
        this.orderCountMonth = rs.orderReceivedMonth;
        this.orderCountToday = rs.orderReceivedToday;
        this.visitProd = rs.orderNotProcess;
        this.visitProdToday = rs.orderNotProcessToday;
        this.grandTotal = rs.grandTotal;
        this.grandTotalRecived = rs.grandTotalDelivered;
        let yearLabel: Label[] = [];
        let listColor: any[] = [];
        if (res.reportYearModel) {
          res.reportYearModel.map((item) => {
            yearLabel.push(item.year);
            listColor.push('#84B761');
          });
          this.barChartLabelsYear = yearLabel;
          this.barChartDataYear = [{ data: res.reportYearModel.map((x) => x.total), label: 'Doanh thu (VNĐ)', backgroundColor: listColor }];
          res.productOrderModels.map((item) => {
            listProd.map((prod) => {
              if (item.productId == prod.id) {
                prod.orderTop = item.quantity;
                if (this.prodOrderFive.length < 5) {
                  this.prodOrderFive.push(prod);
                }
              }
            });
          });
        }
      }
      this.cdf.detectChanges();
    });
  }
  changeYear(event: any) {
    this.dashboardService.getRpMonth(event).subscribe((res) => {
      let data: any[] = [];
      for (let index = 0; index < 12; index++) {
        data.push(0);
      }
      res.reportMonthModel.map((x) => {
        data[x.month - 1] = x.total;
      });
      this.barChartDataMonth = [{ data: data, label: 'Doanh thu (VNĐ)', backgroundColor: this.listColor }];
      this.cdf.detectChanges();
    });
  }
  changeYearQuater(event: any) {
    this.dashboardService.getRpMonth(event).subscribe((res) => {
      let data: any[] = [0, 0, 0, 0];
      let listColor = ['red', 'red', 'red', 'red'];
      res.reportMonthModel.map((item) => {
        switch (item.month) {
          case 1:
          case 2:
          case 3:
            data[0] += item.total;
            break;
          case 4:
          case 5:
          case 6:
            data[1] += item.total;
            break;
          case 7:
          case 8:
          case 9:
            data[2] += item.total;
            break;
          case 10:
          case 11:
          case 12:
            data[3] += item.total;
            break;
          default:
            break;
        }
      });
      console.log(data);
      this.barChartDataQuater = [{ data: data, label: 'Doanh thu (VNĐ)', backgroundColor: listColor }];
      this.cdf.detectChanges();
    });
  }
}
