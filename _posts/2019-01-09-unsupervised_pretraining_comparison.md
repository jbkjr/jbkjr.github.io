---
title: 'Comparing Pre-trained Language Models with Semantic Parsing'
date: 2019-01-09
permalink: /posts/2018/12/unsupervised_pretraining_comparison/
tags:
  - nlp
  - transfer_learning
---

In my [last post]({% post_url 2018-12-24-elmo_sempar %}), I showed how adding ELMo features to a seq2seq model improved performance on semantic parsing tasks. Recently, I have been experimenting with adding [OpenAI GPT](https://blog.openai.com/language-unsupervised/) and [BERT](https://arxiv.org/abs/1810.04805) to the model in order to compare their performance against ELMo's. All the data, configuration files, and scripts needed to reproduce my experiments have been pushed to the [GitHub repository](https://github.com/jbkjr/allennlp_sempar). I'm excited to share my results!

## Improved Results on Baseline and with ELMo

| Model | ATIS | GEO | JOBS |
| --- | --- | --- | --- |
| S2S + attention (old / new) | 75.2 / **79.9** | 62.5 / **68.9** | 58.6 / **71.4** |
| S2S + attention + ELMo (old / new) | 79.0 / **83.3** | 71.1 / **75.7** | 74.3 / **77.9** |

I was able to significantly improve all the results reported in my [last post]({% post_url 2018-12-24-elmo_sempar %}), providing a stronger baseline against which to compare OpenAI GPT and BERT. I was able to achieve this improvement primarily through these three changes to my original code:

* Early stopping is now performed with _sequence accuracy on the validation set_ (previously validation loss). This allows the selection of better models by directly measuring the type of performance we're actually looking for.
* Training for a maximum of more epochs and with greater patience for early stopping.
* Keep separate vocabularies (and tokenizers) for the source- and target-side languages. This probably had some effect on performance of the baseline and ELMo models, but is more important for direct comparison to OpenAI GPT and BERT, which use different tokenization methods.

The rest of this post includes a semi-formal write up of my all methods and results.

## Methods

### Sequence-to-Sequence with Attention

My baseline is a sequence-to-sequence LSTM network with an attention mechanism.[^1] This architecture has already been successfully used in semantic parsing.[^2][^3] All experiments utilize the same sequence-to-sequence architecture: a bidirectional encoder with 200-dimensional hidden units and 100-dimensional embeddings, a bilinear attention mechanism, 100-dimensional embeddings for the decoder, and a beam search of 5 for decoding.

[^1]: Minh-Thang Luong, Hieu Pham, and Christopher D. Manning. 2015. Effective approaches to attention-based neural machine translation. CoRR abs/1508.04025. http://arxiv.org/abs/1508.04025.
[^2]: Robin Jia and Percy Liang. 2016. Data recombination for neural semantic parsing. CoRR abs/1606.03622. http://arxiv.org/abs/1606.03622.
[^3]: Li Dong and Mirella Lapata. 2016. Language to logical form with neural attention. CoRR abs/1601.01280. http://arxiv.org/abs/1601.01280.

### Pre-trained Representations

For all other models, exactly the same sequence-to-sequence model is used as in the baseline except for the input layer for the encoder. Pre-trained representations are only included for encoding the source-side English questions and not the target-side logical queries; the decoder's embedding layer is still randomly initialized and trained normally. For the encoder, the 100-dimensional embedding layer is initialized with GloVe embeddings,[^4] and the input to the LSTM is the concatenation of this 100-dimensional embedding with the representation of the sequence provided by the pre-trained language model used. The GloVe embeddings are allowed to be tuned during training; the pre-trained language models are frozen and instead use a learned "scalar mix" of activations from the pre-trained language model. Thus, the input to the LSTM encoder for the $k$th token $t_k$ in the sequence is

$$\mathbf{e}_k = [\mathbf{r}_k; \mathbf{g}_k]$$

where $\mathbf{g}_k$ is the 100-dimensional GloVe representation of $t_k$ and $\mathbf{r}_k$ is the pre-trained representation of $t_k$:

$$\mathbf{r}_k = \gamma \sum_{j=0}^L \mathbf{s}_j \mathbf{h}_{k,j}$$

where $\mathbf{h}_{k,j}$ is the activation associated with the $k$th token in the $j$th layer of the pre-trained model, $\gamma$ is a learned scalar parameter, and $\mathbf{s} = \text{softmax}(\mathbf{w})$, where $\mathbf{w}$ is an $L$-dimensional learned weight.

[^4]: Jeffrey Pennington, Richard Socher, and Christopher D. Manning. 2014. Glove: Global vectors for word representation. In In EMNLP.

This "scalar mix" approach is essentially equivalent to the one used by ELMo,[^5] whereas ULMFiT,[^6] OpenAI GPT,[^7] and BERT[^8] all utilize a "fine-tuning" approach, in which the entire language model is instead tuned to the downstream task. There are several motivations for using the scalar mix approach in this comparison.

[^5]: Matthew E. Peters, Mark Neumann, Mohit Iyyer, Matt Gardner, Christopher Clark, Kenton Lee, and Luke Zettlemoyer. 2018. Deep contextualized word representations. CoRR abs/1802.05365. http://arxiv.org/abs/1802.05365.

[^6]: Jeremy Howard and Sebastian Ruder. 2018.
Universal language model fine-tuning for text classification. CoRR abs/1801.06146. http://arxiv.org/abs/1801.06146.

[^7]: Alec Radford. 2018. Improving language understand- ing by generative pre-training.

[^8]: Jacob Devlin, Ming-Wei Chang, Kenton Lee, and Kristina Toutanova. 2018. BERT: pre-training of deep bidirectional transformers for language understanding. CoRR abs/1810.04805. http://arxiv.org/abs/1810.04805.

First, it precludes the necessity of determining the best approach to fine-tuning. There is no clear consensus on the best method to fine-tune models in order to avoid the problem of _catastrophic forgetting_, in which the knowledge contained within the pre-trained language model is destroyed as the model adjusts its weights to the target task. ULMFiT uses a combination of discriminative learning rates (different rates for each layer) and layer freezing/unfreezing, OpenAI GPT uses an auxiliary language modeling objective, and BERT ostensibly does not use any technique to avoid catastrophic forgetting. By instead freezing the models and learning how to best utilize the information already contained within them, it is possible to more directly compare their effectiveness.

Moreover, using a scalar mix precludes devising special methods that would be needed to fine-tune pre-trained language models for language generation tasks. Ramachandran et al. (2016) demonstrate one such approach on a sequence-to-sequence model for machine translation.[^9] They utilize residual connections between the pre-trained layers and the randomly initialized RNN encoder-decoder layers, jointly train the seq2seq objective with language model objectives for both the source and target sides, and initialize the softmax layer on the target side with the weights learned with the target-side language model. Implementing such an approach would be substantially more difficult, whereas using a scalar mix allows one to essentially "plug in" pre-trained models into existing sequence-to-sequence implementations. Further, it is unclear as to whether or not a language model for the target-side logical denotations would be necessary, or, even if so, the choice of data on which one might be trained.

[^9]: Prajit Ramachandran, Peter J. Liu, and Quoc V. Le. 2016. Unsupervised pretraining for sequence to sequence learning. CoRR abs/1611.02683. http://arxiv.org/abs/1611.02683.

The rest of this section details how $\mathbf{h}_{k,j}$ is calculated by each of the pre-trained language models used in these experiments and provides some relevant background information for each. The following image provides a visual comparison of the three approaches (taken from the [BERT paper](https://arxiv.org/abs/1810.04805)).

![elmo-openai-bert](/images/model_comparison.png){:class="img-responsive"}

#### ELMo

ELMo utilizes a "biLM" architecture which consists of independently trained forward and backward LSTM language models (with the exception of jointly trained embedding and softmax layers). These representations are concatenated together to produce the ELMo's hidden representation. Thus, for ELMo,

$$\mathbf{h}_{k,j} = [\stackrel{\rightarrow}{\mathbf{h}}^{LM}_{k,j};\stackrel{\leftarrow}{\mathbf{h}}^{LM}_{k,j}]$$

Importantly, ELMo is a _character-level_ language model trained on the 1B Word Benchmark,[^10] which is shuffled at the sentence level. ELMo outputs 1024-dimensional representations, so the input size to the seq2seq + ELMo model is 1124 (after these representations being concatenated with 100-dimensional GloVe embeddings).

[^10]: Ciprian Chelba, Tomas Mikolov, Mike Schuster, Qi Ge, Thorsten Brants, and Phillipp Koehn. 2013. One billion word benchmark for measuring progress in statistical language modeling. CoRR abs/1312.3005. http://arxiv.org/abs/1312.3005.

#### OpenAI GPT

The OpenAI Generatively Pre-trained Transformer (GPT) \cite{openai} utilizes a 12-layer Transformer \textit{decoder-only} architecture \cite{tf_dec}, a variant of the Transformer \cite{transformer}, for its language model. Since it is decoder-only, it effectively acts as a forward language model; it uses masked self-attention, where every token may only attend to context to its left. The activations for each layer $\mathbf{h}_{:,j}$ are computed as follows:

$$\mathbf{h}_{:,0} &= UW_e + W_p$$
$$\mathbf{h}_{:,j} &= \text{transformer\_block}(\mathbf{h}_{:,j-1}) \forall j \in [1,L]$$

where $U$ is the input sequence of tokens, $L$ is the number of layers, $W_e$ is the token embedding matrix, and $W_p$ is the position embedding matrix.
