import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { Asset } from 'src/app/models/asset.model';
import { DataService } from 'src/app/services/data.service';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  barcode:any;
  asset: Asset;
  loading;

  constructor(private barcodeScanner: BarcodeScanner, private alertCtrl: AlertController, private data: DataService, private loadingCtrl: LoadingController) { }

  ngOnInit() {

  }

  scanBarcode() {
    const barcodeOptions = {
      preferFrontCamera : false, // iOS and Android
      showFlipCameraButton : true, // iOS and Android
      showTorchButton : true, // iOS and Android
      torchOn: true, // Android, launch with the torch switched on (if available)
      saveHistory: true, // Android, save scan history (default false)
      prompt : "Place a barcode inside the scan area", // Android
      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      //formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
      orientation : "potrait", // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations : true, // iOS
      disableSuccessBeep: false // iOS and Android
  }
    this.barcodeScanner.scan(barcodeOptions).then(barcodeData => {
      console.log('Barcode data', barcodeData);
      if (barcodeData.cancelled) {
        this.barcode = false;
        this.showAlert('Scanning Cancelled');
      } else if (barcodeData.cancelled === false) {
        this.barcode = barcodeData;
        // Pass barcode to search api
        this.showLoader();
        this.data.findAsset(barcodeData.text)
        .pipe(timeout(5000))
        .subscribe(asset => {
          this.loading.dismiss();
          this.asset = asset;
        }, err => {
          this.loading.dismiss();
          this.showAlert('Asset Not Found');
        })
      }
     }).catch(err => {
         console.log('Error', err);
         this.showAlert('Scanning Failed');
     });
  }

  async showAlert(text: string) {
      let appAlert = await this.alertCtrl.create({
        header: text,
        buttons: ['OK']
      });
      await appAlert.present();

  }

  async showLoader() {
    this.loading = await this.loadingCtrl.create({
      message: 'Searching For Asset',
      spinner: 'lines',
      backdropDismiss: true
    });
    this.loading.present();
  }

}
