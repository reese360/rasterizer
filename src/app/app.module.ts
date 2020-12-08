import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SvgViewboxComponent } from './components/svg-viewbox/svg-viewbox.component';
import { InputFormComponent } from './components/input-form/input-form.component';
import { UserInputService } from './services/userInput.service';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [AppComponent, SvgViewboxComponent, InputFormComponent],
	imports: [BrowserModule, FormsModule],
	providers: [UserInputService],
	bootstrap: [AppComponent],
})
export class AppModule {}
