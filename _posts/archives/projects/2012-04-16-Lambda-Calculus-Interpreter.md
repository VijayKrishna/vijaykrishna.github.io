---
layout: project
title: Lambda Calculus Interpreter in Scheme
tags: scheme lambda-calculus interpreter
categories: ['project', 'class-project']
one-liner: Lamba Calculus interpreter in Scheme.
from: April 2012
to: April 2012
---

[Scheme]: http://en.wikipedia.org/wiki/Scheme_(programming_language)

So this was a cool class project that I worked on where we were to implement a lambda calculus interpreter in any language of our choice. It just seemed too natural to do this in [Scheme][Scheme]. :)

It attempts to implement both alpha and beta reductions.

The following code for the interpreter is also available as a gist, with test cases: [https://gist.github.com/VijayKrishna/5180292.js](https://gist.github.com/VijayKrishna/5180292.js)

{% highlight scheme %}
;;UCI Class Project - INF212 Analysis of Programming Languages
;;Nicholas DiGiuseppe and Vijay Krishna Palepu
;;1.interpreter is not case sensitive.
;;2.interpreter lives in the world of symbols and lists.
;;3.interpreter requires proper parenthesis.
;;4.does not work with numbers such as 1 2 3...
;;reference: http://matt.might.net/articles/implementing-a-programming-language/

;;original 7 lines
; eval takes an expression and an environment to a value
(define (eval e env)
  (display "evaluating ") (display e) (display " with ") (display env) (newline)
  (cond
    ((symbol? e)       
     (begin 
       (display "option 1 ") 
       (display (if (boolean? (assq e env)) e (cadr (assq e env)))) 
       (newline) 
       (if (boolean? (assq e env)) e (cadr (assq e env)))
       )
     )
    ((= 1 (length e))
     (begin
       (display "option 2 ") 
       (display (cons e env)) 
       (newline)
       (eval (car e) env)
       )
     )
    ((eq? (car e) 'λ)  
     (begin 
       (display "option 3 ") 
       (display (cons e env)) 
       (newline) 
       (cons e env)
       )
     )
    (else 
     (begin 
       (display "option 4 ")
       (display e)
       (newline) 
       ;(iterApply e env)
       (apply (eval (car e) env) (eval (cadr e) env))
       )
     )
    )
  )

; apply takes a function and an argument to a value
(define (apply f x)
  (display "applying ") (display x) (display " to ") (display f) (newline)
  (if (symbol? f) ;if it is not pair
      (begin (list f x))
      (let ((chek (lambdaCheck f 0)))
        (cond
          ((= 0 chek) (list (list f x)))
          ((< 0 chek) (list (list (car f) x)))
          (else (eval (cddr (car f)) (cons (list (cadr (car f)) (find f x)) (cdr f))))
          )
        )
      )
  )

;;additions
(define (interpret e env)
  (display " e(interpret): ") (display e) (newline)
  (if (pair? e)
      (let ((e (eval e env)))
        (cond
          ((symbol? e) e) ;consider doing a (not (pair? e)) instead of (symbol? e)
          ((= 1 (length e)) (car e))
          ((and (= 2 (length e)) (symbol? (car e))) e)
          ((= 2 (length e))
           (let ((env (list (cadr e))) (e (car e)))
             (itrate e '() env)
             )
           )
          ((< 2 (length e))
           (let ((env (cdr e)) (e (car e)))
             (itrate e '() env)
             ))
          )
        )
      e
      )
  )

(define (itrate l nl env)
  (if (null? l)
      nl
      (begin 
        (itrate 
         (cdr l) 
         (append 
          nl 
          (list (interpret (car l) env))
          )
         env
         )
        )
      )
  )

;begin alpha reduction
(define (flatten l nl)
  (if (null? l)
      nl
      (begin
        (cond
          ((symbol? (car l)) (flatten (cdr l) (append nl (list (car l)))))
          ((pair? (car l)) (flatten (cdr l) (append nl (flatten (car l) '()))))
          )
        )
      )
  )

(define (find l al)
  (let ((nl (flatten l '())))
    (cond
      ((null? nl) al)
      ((eq? (car nl) 'λ)
       (begin 
         (find (cddr nl) (replace al (cadr nl) '()))
         )
       )
      (else (find (cdr nl) al))   
      )
    )
  )

(define (replace l var nl)
  (if (null? l)
      nl
      (begin
        (if (symbol? l)
            (cond
              ((eq? l var) (string->symbol (string-append (symbol->string var) "1")))
              ((not (eq? l var)) l)
              )
            
            (replace (cdr l) var 
                     (append nl
                             (cond 
                               ((and (symbol? (car l)) (eq? (car l) var)) (list (string->symbol (string-append (symbol->string var) "1"))))
                               ((and (symbol? (car l)) (not (eq? (car l) var))) (list (car l)))
                               ((pair? (car l)) (list (replace (car l) var '())))
                               )
                             )
                     )
            )
        )
      )
  )
;end alpha reduction

(define (lambdaCheck l count)
  (cond
    ((null? l) count)
    ((and (symbol? (car l)) (and (= count 1) (eq? (car l) 'λ)) -1))
    ((and (symbol? (car l)) (not (eq? (car l) 'λ))) count)
    (else (lambdaCheck (car l) (+ 1 count)))
    )
  )
{% endhighlight %}