import { Observable } from 'rxjs';
import { ZipTaskProgressInterface } from './zip-task-progress.interface';

export interface ZipTaskInterface {
  progress: Observable<ZipTaskProgressInterface>;
  data: Observable<Blob>;
}
