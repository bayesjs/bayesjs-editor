[![Build Status](https://travis-ci.org/bayesjs/bayesjs-editor.svg?branch=master)](https://travis-ci.org/bayesjs/bayesjs-editor)
[![Coverage Status](https://coveralls.io/repos/github/bayesjs/bayesjs-editor/badge.svg)](https://coveralls.io/github/bayesjs/bayesjs-editor)

# BayesJs Editor

An editor for Bayesian Networks built in React that uses Bayes' theorem.

# What is [Bayes' Theorem](https://en.wikipedia.org/wiki/Bayes%27_theorem)

In [probability theory](https://en.wikipedia.org/wiki/Probability_theory) and [statistics](https://en.wikipedia.org/wiki/Statistics), Bayes’ theorem describes the probability of an event, based on prior knowledge of conditions that might be related to the event. For example, if cancer is related to age, then, using Bayes’ theorem, a person's age can be used to more accurately assess the probability that they have cancer than can be done without knowledge of the person’s age.

Bayes' Theorem is Mathematically stated as the following equation:

**P(A | B) = (P(B | A).P(A)) / P(B)**

where A and B are events and P(B)!= 0

* P(A | B) is a conditional probability(https://en.wikipedia.org/wiki/Conditional_probability): the likelihood of event A occurring given that B is true.
* P(B | A) is also a conditional probability: the likelihood of event B occurring given that A is true.
* P(A) and P(B) are the probabilities of observing A and B independently of each other; this is known as the [marginal probability](https://en.wikipedia.org/wiki/Marginal_distribution).


## How to setup

```
git clone git@github.com:bayesjs/bayesjs-editor.git
cd bayesjs-editor
yarn // or npm install
```

## How to test

To execute the unit test you can run:
```
yarn run test:unit
```

And to execute the integration test you can run when the project not runnig:
```
yarn run test:e2e
```

or, in case you wanna open the cypress while the project is running, in another terminal run:
```
yarn run cypress open
```

## How to run

```
yarn start
```

## License

MIT
