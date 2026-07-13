import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import { Scale } from 'lucide-react';

export default function TermsPage() {
    useSEO({
        title: 'Terms & Conditions',
        description: 'Read the terms and conditions for using Bunk & Learn Hub.',
        keywords: 'terms, conditions, tos, open source'
    });

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
            <header className="border-b border-slate-200 pb-8">
                <div className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 shadow-sm mb-6">
                    <Scale size={12} className="text-slate-900" />
                    Legal
                </div>
                <h1 className="text-3xl md:text-5xl font-black font-mono tracking-tighter text-slate-900 leading-[0.9] mb-6">
                    Terms & Conditions
                </h1>
            </header>

            <article className="prose prose-slate prose-sm md:prose-base max-w-none prose-headings:font-black prose-headings:tracking-tight">
                <h2>1. Educational Use</h2>
                <p>
                    Bunk & Learn Hub is provided primarily for educational and informational purposes. The algorithms, simulations, and visualizations are designed to help you understand computer science concepts. They should not be relied upon for critical production environments or commercial software calculations without independent verification.
                </p>

                <h2>2. Open Source Notice</h2>
                <p>
                    This project is open-source software licensed under the MIT License. You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, subject to the conditions outlined in the LICENSE file found in the root of our GitHub repository.
                </p>

                <h2>3. No Warranty</h2>
                <p>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                </p>

                <h2>4. Content Disclaimer</h2>
                <p>
                    While we strive for accuracy, the simulations may contain simplifications or abstractions necessary for educational visualization. If you spot a mathematical or algorithmic error, please submit an issue or a pull request to correct it.
                </p>

                <h2>5. Contribution Rules</h2>
                <p>
                    By submitting a pull request to Bunk & Learn Hub, you agree that your contributions will be licensed under the project's MIT License. You also agree to adhere to our Code of Conduct to ensure a welcoming environment for all community members.
                </p>
            </article>
        </div>
    );
}
