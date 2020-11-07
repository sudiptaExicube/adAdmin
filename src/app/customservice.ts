
import { Injectable,NgZone } from '@angular/core';
import { LoadingController, ToastController, Platform, ModalController, App, ViewController, ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { HTTP } from '@ionic-native/http';
declare let google: any;

@Injectable()
export class CustomService {
	loading:any;
	EMAIL_VALID_CHECK:any = /^.+@.+\..+$/;
	constructor(
		public actionSheetCtrl: ActionSheetController,
		public appCtrl:App,
		public modalCtrl: ModalController,
		public platform:Platform,
		public splashScreen: SplashScreen,
		public alertCtrl:AlertController, 
		public loadingCtrl:LoadingController, 
		public toastCtrl: ToastController,

		public zone: NgZone,
	) {}

	presentLoadingDefault() {
		this.loading = this.loadingCtrl.create({
			content: ''
		});
		this.loading.present();
	}
	presentLoadingClose() {
		this.loading.dismiss();
	}

	presentToast(txt:any) {
		let toast = this.toastCtrl.create({
			message: txt,
			duration: 3000,
			position: 'bottom'
		});
		toast.present();
	}

	presentConfirm(alertTitle:any, alertMsg:any, button1:any, button2:any):Promise<any> {
		return new Promise((success)=>{
			let alert = this.alertCtrl.create({
			title: alertTitle,
			message: alertMsg,
			buttons: [
				{
					text: button1,
					role: 'Cancelar',
					handler: () => {
							success(1);
					}
				},
				{
					text: button2,
					handler: () => {
							success(2);
					}
				}
			]
			});
			alert.present();
		});
	}
}

