import { Component, } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OptimizeService } from './optimize.service';
import { CurrencyPipe } from '@angular/common';
import { initializeApp } from '@firebase/app';

type RESPONSE_OBJ = {
  X11: number,
  X12: number,
  X13: number,
  X21: number,
  X22: number,
  X23: number,
  Z: number
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    CurrencyPipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'gestao-horarios';
  isLoading = false;

  form: FormGroup;

  data!: RESPONSE_OBJ

  firebaseConfig = {
    apiKey: "AIzaSyCaq8_acMYsnzkSsKOgR2RQL7hxVfymsug",
    authDomain: "optimize-medicos.firebaseapp.com",
    projectId: "optimize-medicos",
    storageBucket: "optimize-medicos.firebasestorage.app",
    messagingSenderId: "419746738254",
    appId: "1:419746738254:web:655f36b4a65c73b705931f"
  }
  app = initializeApp(this.firebaseConfig);

  constructor(private fb: FormBuilder, private optimizeService: OptimizeService) {
    this.form = this.fb.group({
      qtdTotalClinicos: [0, [Validators.required, Validators.min(1)]],
      qtdTotalEspecialistas: [0, [Validators.required, Validators.min(1)]],
      qtdClinicosTurno1: [0, [Validators.required, Validators.min(0)]],
      qtdClinicosTurno2: [0, [Validators.required, Validators.min(0)]],
      qtdClinicosTurno3: [0, [Validators.required, Validators.min(0)]],
      qtdEspecialistasTurno1: [0, [Validators.required, Validators.min(0)]],
      qtdEspecialistasTurno2: [0, [Validators.required, Validators.min(0)]],
      qtdEspecialistasTurno3: [0, [Validators.required, Validators.min(0)]],
    });
  }

  // Custom validation for total count
  validateTotals() {
    const totalClinicos =
      this.form.value.qtdClinicosTurno1 +
      this.form.value.qtdClinicosTurno2 +
      this.form.value.qtdClinicosTurno3;
    const totalEspecialistas =
      this.form.value.qtdEspecialistasTurno1 +
      this.form.value.qtdEspecialistasTurno2 +
      this.form.value.qtdEspecialistasTurno3;

    return (
      totalClinicos <= this.form.value.qtdTotalClinicos &&
      totalEspecialistas <= this.form.value.qtdTotalEspecialistas
    );
  }

  onSubmit() {
    this.isLoading = true;
    if (this.form.valid && this.validateTotals()) {
      const sanitizedForm = {
        qtdTotalC: this.form.value.qtdTotalClinicos,
        qtdTotalE: this.form.value.qtdTotalEspecialistas,
        qtdNecessariaC1: this.form.value.qtdClinicosTurno1,
        qtdNecessariaC2: this.form.value.qtdClinicosTurno2,
        qtdNecessariaC3: this.form.value.qtdClinicosTurno3,
        qtdNecessariaE1: this.form.value.qtdEspecialistasTurno1,
        qtdNecessariaE2: this.form.value.qtdEspecialistasTurno2,
        qtdNecessariaE3: this.form.value.qtdEspecialistasTurno3,
      };
      this.optimizeService.getOptimizeData(sanitizedForm).subscribe(data => {
        console.log(data);
        this.data = data as RESPONSE_OBJ;
        this.isLoading = false;
      });
    } else {
      alert(
        'Verifique os campos. Certifique-se de que os totais não excedem os valores disponíveis.'
      );
    }
  }
}
