import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './component/modal/modal.component';
import { ApiService } from './service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  workItemsForm: FormGroup;
  searchTag = new FormGroup({
    text: new FormControl('')
  });

  config = {
    class: 'modal-dialog-centered'
  }

  constructor(private formBuilder: FormBuilder, public modalService: NgbModal, public apiService: ApiService) {
    this.workItemsForm = this.formBuilder.group({
      workItems: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.loadWorkItems();
  }

  loadWorkItems() {
    this.apiService.getWorkItems().then(workItems => {
      const workItemsArray = this.workItemsForm.get('workItems') as FormArray;
      workItemsArray.clear();

      workItems.forEach(w => {
        const workItemGroup = this.formBuilder.group({
          id: new FormControl(w.id),
          title: new FormControl(w.fields.Title),
          state: new FormControl(w.fields.State),
          type: new FormControl(w.fields.WorkItemType)
        });
        workItemsArray.push(workItemGroup);
      });
    });
  }

  openBrief() {
    const modalRef = this.modalService.open(ModalComponent, {
      centered: true,
      size: 'md',
      backdrop: 'static',
      keyboard: true
    });
  }

  getWorkItems() {
    const searchText = this.searchTag.get('text')?.value.toLowerCase();
    const workItems = (this.workItemsForm.get('workItems') as FormArray).value;
    if (searchText) {
      return workItems.filter((w: { title: string; }) => w.title.toLowerCase().includes(searchText));
    } else {
      return workItems;
    }
  }
}
