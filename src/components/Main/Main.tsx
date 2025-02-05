import { ChartComponent } from 'components/Chart'
import { FileUpload } from 'components/FileUploader'

export const Main: React.FC = () => {
	return (
		<div>
			<FileUpload />
			<ChartComponent />
		</div>
	)
}
