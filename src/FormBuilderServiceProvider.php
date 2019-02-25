<?php

namespace AwesIO\FormBuilder;

use AwesIO\BaseJS\AwesProvider;
use Illuminate\Support\Collection;

class FormBuilderServiceProvider extends AwesProvider
{

    public function boot()
    {
        parent::boot();

        Collection::macro('fbSelect', function ($name = 'name') {
            return $this->map(function ($item) use ($name) {
                return [
                    'name' => $item[$name],
                    'value' => $item['id']
                ];
            });
        });
    }

    public function getPackageName(): string
    {
        return 'form-builder';
    }

    public function getPath(): string
    {
        return __DIR__;
    }
}
