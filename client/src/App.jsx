import './App.css';
import ClassGroup from './components/ClassGroup';

function App() {
	return (
		<main className="flex flex-row">
			<section>
				<h1 className="text-4xl font-bold text-red-600">
					Class Display
				</h1>
			</section>
			<section>
				<ClassGroup />
			</section>
		</main>
	);
}

export default App;
