import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  categoryId: string | null = null;
  offset = 0;
  limit = 10;
  products: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => { // Hacemos el switchMap para evitar caer en multiples subscribes
          this.categoryId = params.get('id');
          if (this.categoryId) {
            return this.productsService.getProductByCategory(
              this.categoryId,
              this.limit,
              this.offset
            );
          }
          return []; // debemos tener encuenta que el switchMap debe retornar un Observable por lo que si no encuentra un getProductByCategory devolvemos un []
        })
      )
      .subscribe((data) => {
        this.products = data;
      });
  }

  onLoadMore() {
    this.productsService.getAll(this.limit, this.offset).subscribe((data) => {
      this.products = this.products.concat(data);
      this.offset += this.limit;
    });
  }
}
